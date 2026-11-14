import { randomUUID } from "node:crypto";
import catalog from "../../catalog.json";

export const runtime = "nodejs";

type Customer = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  address?: unknown;
  apartment?: unknown;
  city?: unknown;
  region?: unknown;
  postalCode?: unknown;
  country?: unknown;
};

type IncomingOrder = {
  customer?: Customer;
  paymentMethod?: unknown;
  currency?: unknown;
  displaySubtotal?: unknown;
  items?: unknown;
};

const paymentNames: Record<string, string> = {
  zelle: "Zelle",
  paypal: "PayPal",
  applepay: "Apple Pay",
  bank: "Bank transfer",
  chime: "Chime",
};

function clean(value: unknown, maxLength = 180): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.ORDERS_TO_EMAIL;
  const sender = process.env.ORDERS_FROM_EMAIL;

  if (!apiKey || !recipient || !sender) {
    return Response.json(
      { error: "Order email is not configured on this site yet." },
      { status: 503 },
    );
  }

  let body: IncomingOrder;
  try {
    body = (await request.json()) as IncomingOrder;
  } catch {
    return Response.json({ error: "The order details could not be read." }, { status: 400 });
  }

  const customer = body.customer || {};
  const name = clean(customer.name, 100);
  const email = clean(customer.email, 180);
  const phone = clean(customer.phone, 60);
  const address = clean(customer.address, 180);
  const apartment = clean(customer.apartment, 120);
  const city = clean(customer.city, 100);
  const region = clean(customer.region, 100);
  const postalCode = clean(customer.postalCode, 30);
  const country = clean(customer.country, 80);
  const paymentMethod = clean(body.paymentMethod, 30);
  const currency = clean(body.currency, 3);
  const displaySubtotal = clean(body.displaySubtotal, 40);

  if (
    !name ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !phone ||
    !address ||
    !city ||
    !region ||
    !postalCode ||
    !country ||
    !paymentNames[paymentMethod] ||
    !["AUD", "USD", "CAD"].includes(currency) ||
    !displaySubtotal
  ) {
    return Response.json({ error: "Please check your contact, delivery, and payment details." }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 45) {
    return Response.json({ error: "Your bag is empty or contains too many items." }, { status: 400 });
  }

  const orderItems: { name: string; quantity: number; unitPrice: number }[] = [];
  for (const item of body.items) {
    if (!item || typeof item !== "object") {
      return Response.json({ error: "An item in your bag could not be checked." }, { status: 400 });
    }
    const itemRecord = item as Record<string, unknown>;
    const id = Number(itemRecord.id);
    const quantity = Number(itemRecord.quantity);
    const product = catalog.find((entry) => entry.id === id);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return Response.json({ error: "An item in your bag could not be checked." }, { status: 400 });
    }
    orderItems.push({ name: product.name, quantity, unitPrice: product.price });
  }

  const reference = randomUUID().slice(0, 8).toUpperCase();
  const baseSubtotal = orderItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const itemRows = orderItems
    .map(
      (item) =>
        `<tr><td>${escapeHtml(item.name)}</td><td>${item.quantity}</td><td>AUD $${item.unitPrice.toFixed(2)}</td><td>AUD $${(item.unitPrice * item.quantity).toFixed(2)}</td></tr>`,
    )
    .join("");
  const fullAddress = [address, apartment, city, region, postalCode, country]
    .filter(Boolean)
    .map(escapeHtml)
    .join(", ");

  let emailResponse: Response;
  try {
    emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      from: sender,
      to: [recipient],
      reply_to: email,
      subject: `New Paws on Board order request ${reference}`,
      html: `
        <h1>New order request ${reference}</h1>
        <h2>Customer</h2>
        <p><strong>${escapeHtml(name)}</strong><br>${escapeHtml(email)}<br>${escapeHtml(phone)}</p>
        <p>${fullAddress}</p>
        <h2>Items</h2>
        <table border="1" cellpadding="8" cellspacing="0">
          <thead><tr><th>Product</th><th>Qty</th><th>Unit price</th><th>Line total</th></tr></thead>
          <tbody>${itemRows}</tbody>
        </table>
        <p>Checkout subtotal shown to customer: ${escapeHtml(displaySubtotal)} ${escapeHtml(currency)}</p>
        <p>Catalogue base subtotal: AUD $${baseSubtotal.toFixed(2)}</p>
        <p>Payment preference: ${escapeHtml(paymentNames[paymentMethod])}</p>
        <p>Payment has not been taken. Reply to the customer to confirm delivery and send payment instructions.</p>
      `,
      }),
    });
  } catch {
    return Response.json(
      { error: "We could not email your order request. Please try again in a moment." },
      { status: 502 },
    );
  }

  if (!emailResponse.ok) {
    return Response.json(
      { error: "We could not email your order request. Please try again in a moment." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true, orderReference: reference });
}
