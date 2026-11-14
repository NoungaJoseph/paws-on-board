import catalog from "../../catalog.json";
import Store from "../../store";
export function generateStaticParams() {
  return catalog.map((p) => ({ slug: p.slug }));
}
export default async function Product({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <Store initialSlug={slug} />;
}
