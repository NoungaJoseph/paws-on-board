"use client";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  ShoppingBag,
  X,
  Plus,
  Minus,
  Menu,
  PawPrint,
  Car,
  Tent,
  Footprints,
  Droplets,
  Utensils,
  Check,
  ChevronDown,
  Heart,
  Package,
  MoveRight,
} from "lucide-react";
import data from "./catalog.json";
import { markets, useCurrency, type Market } from "./currency";
import { HolidayCarousel, AdventureVideo, useReducedMotion } from "./motion";
type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  slug: string;
  image?: string | null;
  items?: number[];
  separate?: number;
  saving?: number;
  phase?: string;
};
const products: Product[] = data;
const categories = [
  "All products",
  "Car travel",
  "Camping",
  "Food & water",
  "Clean-up",
  "Walks",
  "Bundles",
];
const icons = [Package, Car, Tent, Utensils, Droplets, Footprints, Package];
const descriptions: Record<string, string> = {
  "Car travel":
    "Make room for your favourite passenger. Practical protection and thoughtful extras for everyday drives and weekend escapes.",
  Camping:
    "A little comfort, wherever you pull up. Pack the essentials for slow mornings, fresh air and nights away together.",
  "Food & water":
    "Keep food and water close at hand, from the first rest stop to the last stretch of trail.",
  "Clean-up":
    "For muddy paws and very good adventures. Simple essentials to make the journey home a little cleaner.",
  Walks:
    "Everyday essentials for sniff-filled strolls, training days and exploring somewhere new.",
  Bundles:
    "Good things, better together. A thoughtfully paired set for your next outing, with a little saving built in.",
};
const productDetails: Record<string, string> = {
  "hard-bottom-back-seat-extender": "A hard-bottom extender is made to give your dog a more continuous place to settle across the back seat, instead of balancing like a furry tightrope artist. Measure the seat and footwell first, and check the final fit and attachment points for your vehicle.",
  "waterproof-boot-liner-with-bumper-flap": "A practical layer between the boot and whatever your dog enthusiastically found outside. The bumper flap is there for that easily scuffed edge when paws hop in and out; measure your cargo area before choosing.",
  "foldable-dog-car-ramp": "For dogs who would rather use a ramp than make every car trip an Olympic long jump. Check the ramp dimensions, weight rating and your vehicle’s loading height before use, and introduce it slowly on level ground.",
  "xl-hard-bottom-seat-extender": "The roomier version for bigger dogs, sprawling sleepers or anyone who believes the whole back seat belongs to them. Check your seat width and footwell measurements so the extended surface suits your car.",
  "foldable-elevated-dog-camping-cot": "A raised spot to flop down after a day of exploring, with less direct contact with the ground at camp. Check the cot’s final size and weight rating against your dog before packing it for a trip.",
  "washable-non-slip-extender-mat": "A washable layer for the seat extender when paws bring a little of the outdoors along for the ride. It is designed to help stay put, but check the finished dimensions against your extender before ordering.",
  "spare-extender-strap-set": "A spare set of straps is the sort of thing that feels boring right up until you need one. Check the connector style and compatibility with your seat extender before adding it to your kit.",
  "front-passenger-seat-protector": "For the co-pilot who prefers the front seat and leaves behind a generous amount of fur. Measure the seat and check how the protector attaches in your vehicle before use.",
  "rear-door-protector-pair": "A handy barrier for the door panels that tend to collect muddy paw prints and nose-level curiosity. Check the shape and attachment points against your rear doors to make sure the pair is a good match.",
  "cargo-sidewall-protector-pair": "Boot floors get plenty of attention; sidewalls deserve backup too. These protectors are intended to cover the cargo sides, so measure the area and check the final fit for your vehicle.",
  "padded-back-seat-protector-without-rigid-base": "A cushioned cover for keeping everyday paw traffic off the back seat, without adding a rigid base. It is a simpler option for dogs who already have room to sit or lie comfortably; check your seat measurements first.",
  "headrest-storage-organiser": "Keeps the small road-trip essentials together, so wipes, leads and snacks are not playing hide-and-seek under the seat. Check the organiser’s final layout and attachment style for your car.",
  "collapsible-water-bowl": "A water bowl that packs down when the pit stop is over, because carrying a full-size bowl everywhere is a commitment. Check its finished capacity and folded size to see if it suits your dog and day bag.",
  "quick-dry-dog-towel": "For the post-swim shake that somehow reaches every passenger. Keep a towel close for drying muddy or damp fur before your dog claims the clean seats; check the final size for your dog.",
  "reusable-pet-hair-remover": "A reusable helper for lifting loose pet hair from the places it settles in, like car seats and blankets. Follow the care instructions for the confirmed surface compatibility, and give it a quick clean between rounds.",
  "travel-pouch": "A small home for the little things that otherwise migrate around your bag: treats, waste bags or a spare lead. Check the final dimensions to make sure your usual essentials fit.",
  "portable-paw-cleaner": "For the classic muddy-paw situation: dog is thrilled, car is less so. Keep this nearby for a quick clean after walks, and check the final size and cleaning instructions before use.",
  "microfibre-drying-mitt-pair": "Two mitts make it easier to dry paws and lower legs after a wet walk, one paw at a time (while negotiating with the other). Check the final size and washing instructions when confirmed.",
  "dog-drying-robe": "A wearable towel for dogs who come back from the beach looking like the beach came with them. Check the size guide carefully so it fits your dog comfortably, and follow the care instructions.",
  "washable-car-detailing-cloth-set": "A few washable cloths for the human side of post-adventure clean-up: wipe the boot, tidy a spill, restore a little order. Check the final care guidance and keep separate cloths for different jobs if you prefer.",
  "portable-dog-water-bottle": "A handy way to bring water along for walks and drives without carrying a separate bottle and bowl. Check the confirmed capacity and dispensing instructions, and offer your dog regular chances to drink.",
  "collapsible-food-bowl": "A packable bowl for meals away from home, from a campsite breakfast to the snack stop that was definitely planned for the dog. Check its capacity and folded size against your travel kit.",
  "roll-top-kibble-bag": "Keeps a portion of kibble together for weekends away and long days out, instead of relying on a crinkly bag that never closes quite right. Check the final capacity and care details before packing food.",
  "silicone-feeding-mat": "A defined dinner zone for enthusiastic eaters and the bits of kibble that make a break for freedom. Check the finished size against your bowls and feeding spot; clean it according to the final care instructions.",
  "insulated-dog-travel-tote": "A carry-all for bringing your dog’s outing essentials together, with insulation intended to help buffer the contents from outside temperatures. Check the finished capacity and care guidance; it is not a substitute for safe food storage.",
  "roll-up-padded-travel-bed": "A familiar place to rest when the scenery changes, then rolls up when it is time to move on. Check the packed size, sleeping dimensions and care instructions to see if it suits your dog and your boot space.",
  "water-resistant-picnic-blanket": "A shared patch of space for park breaks, beach pauses and sitting down before your dog decides you have sat down enough. The water-resistant finish is designed for light ground damp; check the final size and care details.",
  "reflective-walking-lead": "An everyday lead with reflective details to help you be more visible on lower-light walks. It does not replace a light or careful road awareness; check the final length and hardware before use.",
  "long-training-lead": "Extra length gives you more room for recall practice and supervised exploring in a suitable open area. Use it with a well-fitted harness or collar, keep hold of the line, and check the final length and hardware rating.",
  "treat-pouch-with-belt-clip": "Keeps rewards within easy reach for training, good manners and the occasional very persuasive sit. Check how the clip attaches to your clothing and whether the pouch holds the treats you use.",
  "waste-bag-dispenser-with-starter-roll": "A simple way to keep bags attached to your walking kit, because the one time you forget is always the memorable one. Check the dispenser’s roll size before buying refills.",
  "waste-bag-refill-multipack": "A stash of replacement rolls so your walks do not depend on finding that last bag at the bottom of a pocket. Check roll compatibility with your dispenser and follow local waste-disposal rules.",
  "dog-travel-bundle": "A straightforward starter kit for the car: a seat extender, collapsible water bowl and quick-dry towel. It covers the ride, the water stop and the damp-dog finale; check each item’s fit and size for your setup.",
  "dog-travel-and-clean-up-bundle": "Pairs the seat extender and water bowl with a towel, reusable hair remover and travel pouch. A useful set for the full outing, including the furry evidence that the outing happened; check the vehicle fit and each item’s care details.",
  "full-car-protection-bundle": "Combines a back-seat extender with a boot liner, giving you options for passengers who travel in either part of the car. Measure both spaces and check the installation details for your vehicle before choosing.",
  "boot-and-bumper-bundle": "A boot liner plus cargo sidewall protectors for covering more of the space your dog rides in. Check the boot floor, bumper edge and sidewall measurements so the pieces suit your cargo area.",
  "suv-loading-bundle": "Brings together a loading ramp and boot liner for dogs who need a hand getting in and a protected place to ride. Confirm the ramp’s weight rating and loading height, then measure the boot before use.",
  "xl-road-trip-bundle": "An XL back-seat extender with a water bottle, towel and travel pouch for the dog who packs no lighter than you do. Check the extender fit and the capacity of the travel items for your car and your dog.",
  "weekend-camping-bundle": "A cot, picnic blanket, water bowl and food bowl for making camp a little more comfortable. Check the cot’s weight rating and dimensions, and make sure the bowls suit your dog’s portions.",
  "travel-feeding-pack": "Brings together a water bottle, food bowl, kibble bag and feeding mat for meals and drink breaks away from home. Check the capacities and packed sizes against your dog’s routine and available bag space.",
  "muddy-paws-clean-up-pack": "A paw cleaner, quick-dry towel, drying mitts and cloths for the muddy return journey. It is a small clean-up crew for paws, coats and the car; check each item’s size and care guidance.",
  "walk-and-train-pack": "Pairs a reflective lead and long training lead with a treat pouch, dispenser and refill rolls. You have the basics for an everyday walk and a supervised practice session; check lead compatibility and use the long line in an appropriate open area.",
  "holiday-road-trip-bundle": "A seat extender, water bowl, towel, hair remover and paw cleaner for the complete car-trip arc: setting off, stopping for a drink and arriving with a dog who has had a wonderful time. Check the extender fit and each item’s final dimensions.",
  "christmas-adventure-bundle": "A camping cot, water bottle, kibble bag, travel bed and picnic blanket for a festive escape with your favourite tagalong. Check the sleeping sizes, capacities and care instructions before packing for the trip.",
  "coastal-clean-up-bundle": "Pairs a boot liner with a towel, paw cleaner and drying mitts for sandy feet and salty, happy dogs. Measure your boot and check each item’s dimensions; shake off loose sand before packing the gear away.",
};

type Review = {
  name: string;
  dog: string;
  rating: number;
  text: string;
  sample?: boolean;
};
type PaymentMethodId = "zelle" | "paypal" | "applepay" | "bank" | "chime";
type CheckoutDetails = {
  name: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  region: string;
  postalCode: string;
  country: Market;
};
const paymentMethods: { id: PaymentMethodId; name: string; detail: string }[] = [
  { id: "zelle", name: "Zelle", detail: "We will email the payment details after reviewing your order." },
  { id: "paypal", name: "PayPal", detail: "We will email the payment details after reviewing your order." },
  { id: "applepay", name: "Apple Pay", detail: "We will email the payment details after reviewing your order." },
  { id: "bank", name: "Bank transfer", detail: "We will email the bank details after reviewing your order." },
  { id: "chime", name: "Chime", detail: "We will email the payment details after reviewing your order." },
];
function PaymentLogo({ method }: { method: PaymentMethodId }) {
  const title = paymentMethods.find((payment) => payment.id === method)?.name || method;
  return (
    <svg className={`payment-logo payment-logo-${method}`} viewBox="0 0 132 40" role="img" aria-label={title}>
      {method === "zelle" && (
        <>
          <path d="M10 8h18L16 22h12v10H8l12-14H10z" fill="#6d1ed4" />
          <text x="34" y="28" fill="#5c1bb5" fontSize="23" fontWeight="700" fontFamily="Arial, sans-serif">Zelle</text>
        </>
      )}
      {method === "paypal" && (
        <>
          <path d="M9 8h13c7 0 10 4 8 10-1 6-5 9-12 9h-4l-2 7H5z" fill="#003087" />
          <path d="M14 3h13c7 0 10 4 8 10-1 6-5 9-12 9h-4l-2 7h-7z" fill="#009cde" />
          <text x="40" y="27" fill="#003087" fontSize="20" fontWeight="700" fontFamily="Arial, sans-serif">PayPal</text>
        </>
      )}
      {method === "applepay" && (
        <>
          <path d="M22 12c-3 0-4 2-6 2-1 0-3-2-5-2-5 0-8 5-8 10 0 6 4 13 8 13 2 0 3-1 5-1 1 0 3 1 4 1 3 0 6-5 7-8-4-2-4-8 1-10-2-3-4-5-6-5zM20 4c0 4-3 6-7 6 0-4 3-6 7-6z" fill="#111" />
          <text x="39" y="27" fill="#111" fontSize="21" fontWeight="600" fontFamily="Arial, sans-serif">Pay</text>
        </>
      )}
      {method === "bank" && (
        <>
          <path d="M4 14 20 5l16 9v3H4zm4 5h4v12H8zm10 0h4v12h-4zm10 0h4v12h-4zM4 34h32v3H4z" fill="#345341" />
          <text x="45" y="27" fill="#345341" fontSize="18" fontWeight="700" fontFamily="Arial, sans-serif">TRANSFER</text>
        </>
      )}
      {method === "chime" && (
        <>
          <path d="M20 7a13 13 0 1 0 12 18h-8a6 6 0 1 1-4-10z" fill="#007b75" />
          <text x="40" y="27" fill="#007b75" fontSize="21" fontWeight="700" fontFamily="Arial, sans-serif">chime</text>
        </>
      )}
    </svg>
  );
}
const reviewSamples: Record<string, Review> = {
  "hard-bottom-back-seat-extender": { name: "Mia", dog: "Bean", rating: 5, text: "The first drive where Bean could stretch out without me rearranging the whole back seat at every stop. He gives it five stars; I give the quieter ride five more." },
  "waterproof-boot-liner-with-bumper-flap": { name: "Jordan", dog: "Otis", rating: 5, text: "Otis treats every puddle as a networking opportunity. The boot is much easier to tidy after our walks, and he still gets to be joyfully ridiculous." },
  "foldable-dog-car-ramp": { name: "Priya", dog: "Mochi", rating: 4, text: "Mochi needed a little time to get comfortable with the ramp, but the patient practice paid off. We take it slowly and she now approaches the car with much more confidence." },
  "xl-hard-bottom-seat-extender": { name: "Theo", dog: "Pickle", rating: 5, text: "Pickle is a professional back-seat sprawler. The extra room means fewer negotiations about whose elbow is where on longer drives." },
  "foldable-elevated-dog-camping-cot": { name: "Alex", dog: "Miso", rating: 5, text: "Miso claimed the camp cot before we had finished unpacking. She now supervises breakfast from her elevated command post." },
  "washable-non-slip-extender-mat": { name: "Harper", dog: "Juniper", rating: 4, text: "Juniper's paws bring home souvenirs from every walk. It's lovely having a layer I can lift out and wash instead of negotiating with the entire car seat." },
  "spare-extender-strap-set": { name: "Maya", dog: "Pogo", rating: 5, text: "A spare set is not glamorous, but neither is discovering a missing strap five minutes before a road trip. Future me is very grateful." },
  "front-passenger-seat-protector": { name: "Casey", dog: "Marlow", rating: 5, text: "Marlow has promoted himself to front-seat supervisor. This makes my co-pilot's area easier to keep tidy between adventures." },
  "rear-door-protector-pair": { name: "Ingrid", dog: "Sol", rating: 4, text: "Sol likes to watch the world through the window and leave nose art as a souvenir. I appreciate having a little extra coverage where the paw prints land." },
  "cargo-sidewall-protector-pair": { name: "Tessa", dog: "Pip", rating: 5, text: "Pip somehow manages to touch every surface in the boot at once. Covering the sides too feels like a very sensible decision made by someone who knows my dog." },
  "padded-back-seat-protector-without-rigid-base": { name: "Ravi", dog: "Teddy", rating: 5, text: "Teddy likes a soft landing after his walks and I like not finding quite so much fur on the seat. We have reached a rare car-related agreement." },
  "headrest-storage-organiser": { name: "Olivia", dog: "Crumb", rating: 4, text: "Wipes, treats and the lead finally have assigned seats. Crumb remains convinced the treats should have priority boarding." },
  "collapsible-water-bowl": { name: "Finley", dog: "Skipper", rating: 5, text: "Skipper spots a water break from approximately three postcodes away. This packs neatly into our walk kit and makes pit stops much less improvised." },
  "quick-dry-dog-towel": { name: "Carmen", dog: "Biscuit", rating: 5, text: "Biscuit's post-swim shake has a surprisingly wide splash radius. Having the towel ready means I can intercept at least some of the weather system." },
  "reusable-pet-hair-remover": { name: "Rory", dog: "Bramble", rating: 4, text: "Bramble leaves a little calling card wherever she naps. A reusable clean-up tool is a welcome addition to our very ongoing upholstery relationship." },
  "travel-pouch": { name: "Sienna", dog: "Moon", rating: 5, text: "The little essentials used to migrate between pockets like they were planning an escape. This gives Moon's snacks and spare bags a reliable home." },
  "portable-paw-cleaner": { name: "Jamie", dog: "Maple", rating: 5, text: "Maple has never met a muddy trail she didn't love. A quick paw tidy at the car means we can enjoy the walk without bringing the entire trail home." },
  "microfibre-drying-mitt-pair": { name: "Noah", dog: "Nori", rating: 4, text: "Nori is fine with one paw being dried, then acts surprised when we need the other three. The pair makes the post-rain routine a little easier." },
  "dog-drying-robe": { name: "Belle", dog: "Dexter", rating: 5, text: "Dexter comes back from the beach looking like he has personally rearranged the shoreline. The robe helps us get home before he redecorates the seats." },
  "washable-car-detailing-cloth-set": { name: "Amara", dog: "Winnie", rating: 4, text: "Winnie is a tidy passenger in spirit. The cloths are handy for all the little paw prints that suggest otherwise." },
  "portable-dog-water-bottle": { name: "Callum", dog: "Peanut", rating: 5, text: "Peanut's walk pace is ‘sprint, sniff, thirst’. Having water close by keeps our stops simple and gives him a chance to catch his breath." },
  "collapsible-food-bowl": { name: "Laila", dog: "Scout", rating: 4, text: "Scout has a sixth sense for meal time, even when we're nowhere near the kitchen. This makes our day-trip lunches much easier to manage." },
  "roll-top-kibble-bag": { name: "Felix", dog: "Blue", rating: 5, text: "Blue takes weekend breakfast very seriously. Packing his kibble separately means I can find his food without unpacking the whole car like a magician with a bad trick." },
  "silicone-feeding-mat": { name: "Jasmine", dog: "Chai", rating: 4, text: "Chai's bowl has a habit of touring the kitchen mid-meal. A defined spot makes dinner feel a bit less like a slow-motion chase." },
  "insulated-dog-travel-tote": { name: "Ellis", dog: "Frankie", rating: 5, text: "Frankie's outing kit is somehow larger than mine. This gives me one place to gather it all before he starts the very persuasive ‘we're late’ stare." },
  "roll-up-padded-travel-bed": { name: "June", dog: "Marley", rating: 5, text: "Marley settles faster when there's a familiar place to land after a long day. It rolls away neatly when our resident nap supervisor is ready to move on." },
  "water-resistant-picnic-blanket": { name: "Beck", dog: "Willow", rating: 4, text: "Willow loves a park picnic almost as much as she loves investigating the dampest patch of grass. We both get a comfier place to pause." },
  "reflective-walking-lead": { name: "Asha", dog: "Toto", rating: 5, text: "Toto likes one last evening sniff before bed. The reflective details are a thoughtful extra for our lower-light strolls." },
  "long-training-lead": { name: "Kieran", dog: "Badger", rating: 5, text: "Badger's recall practice is a work in progress and his enthusiasm is not. This gives us more room to practise together while I stay in control of the line." },
  "treat-pouch-with-belt-clip": { name: "Zoe", dog: "Sprout", rating: 5, text: "Sprout can hear a treat packet from another dimension. Keeping rewards close makes our training walks smoother and my pockets less crumb-filled." },
  "waste-bag-dispenser-with-starter-roll": { name: "Margot", dog: "Benny", rating: 4, text: "Benny's walks are lovely, memorable and occasionally require a bag with no warning. This keeps one attached to the lead where it belongs." },
  "waste-bag-refill-multipack": { name: "Ezra", dog: "Poppy", rating: 5, text: "Poppy has never once been caught without a plan. I am trying to match her preparedness, and spare rolls are a promising start." },
  "dog-travel-bundle": { name: "Erin", dog: "Pippin", rating: 5, text: "The car, water stop and post-walk towel are all covered. Pippin brings the enthusiasm; I bring one less overstuffed bag." },
  "dog-travel-and-clean-up-bundle": { name: "Kai", dog: "Waffles", rating: 5, text: "Waffles can turn a quick outing into a mud-and-fur festival. Having the clean-up bits together is the closest thing we have to a graceful exit." },
  "full-car-protection-bundle": { name: "Ruby", dog: "Tater", rating: 4, text: "We use different parts of the car for different adventures, and Tater believes they are all his. It's nice having a few more areas covered." },
  "boot-and-bumper-bundle": { name: "Morgan", dog: "Tilly", rating: 5, text: "Tilly leaps into the boot like she has a very important appointment. I like that we have thought about the bumper and sides as well as the floor." },
  "suv-loading-bundle": { name: "Eden", dog: "Sesame", rating: 5, text: "Sesame prefers a calmer way into the car. We take the ramp slowly, and having the boot ready for the ride makes the whole routine feel considered." },
  "xl-road-trip-bundle": { name: "Ash", dog: "Cricket", rating: 4, text: "Cricket is a big dog with a big idea of personal space. This set has the road-trip basics together, which leaves more room in my brain for navigation." },
  "weekend-camping-bundle": { name: "Nia", dog: "Laszlo", rating: 5, text: "Laszlo is an excellent camper and an even better breakfast supervisor. This gives him a comfortable corner while we get on with the important business of coffee." },
  "travel-feeding-pack": { name: "Owen", dog: "Boba", rating: 5, text: "Boba's travel meals now have a system instead of a collection of bags rolling around the boot. He has not commented, but he has eaten on schedule." },
  "muddy-paws-clean-up-pack": { name: "Lena", dog: "Churro", rating: 4, text: "Churro finds the mud; I find the towel and paw cleaner. It's a partnership, and this pack has improved my half of it considerably." },
  "walk-and-train-pack": { name: "Drew", dog: "Clover", rating: 5, text: "Clover is clever, quick and deeply interested in snacks. Having the walking and training bits together means I can keep up with all three." },
  "holiday-road-trip-bundle": { name: "Ada", dog: "Toastie", rating: 5, text: "A long drive with Toastie used to involve several rummaging breaks. This covers the useful things and leaves us with more time for the scenic stops." },
  "christmas-adventure-bundle": { name: "Reece", dog: "Fable", rating: 4, text: "Fable thinks every campsite is a new kingdom to inspect. We have the comfy bits and feeding basics packed, so the royal tour can begin." },
  "coastal-clean-up-bundle": { name: "Mira", dog: "Goose", rating: 5, text: "Goose exits the beach with sand in places I didn't know a dog could have sand. This set makes the trip home feel far less like bringing the coast with us." },
};
const popularProductReviewSamples: Record<string, Review[]> = {
  "hard-bottom-back-seat-extender": [
    { name: "Imani", dog: "Rolo", rating: 5, text: "Rolo is happiest when the whole back seat is apparently his. This makes long drives feel easier for both of us, especially when he settles in for a nap." },
    { name: "Gabe", dog: "Lumi", rating: 4, text: "Our old car setup involved a blanket, three towels and some optimism. This feels like a much more considered place for Lumi to ride." },
  ],
  "waterproof-boot-liner-with-bumper-flap": [
    { name: "Nell", dog: "Bram", rating: 5, text: "Bram has a gift for finding wet grass immediately before we get in the car. The liner makes the ride home feel a lot less like a clean-up mission." },
    { name: "Dario", dog: "Pippa", rating: 4, text: "We do a lot of muddy park walks. I like having the bumper edge covered when Pippa hops in with her usual enthusiasm." },
  ],
  "foldable-dog-car-ramp": [
    { name: "Mei", dog: "Rex", rating: 5, text: "Rex took a few short practice sessions to get the hang of it. Now we can take our time getting into the car instead of making every trip a leap." },
    { name: "Hugo", dog: "Maisie", rating: 4, text: "Maisie is a cautious traveller, so a calm routine matters. We introduced the ramp slowly and she is much more relaxed about loading up." },
  ],
  "collapsible-water-bowl": [
    { name: "Penny", dog: "Arlo", rating: 5, text: "Arlo has never passed a water break without stopping. This is easy to keep in my walking bag and he takes it as a sign that the adventure is going well." },
    { name: "Malik", dog: "Daisy", rating: 5, text: "Daisy and I are both happier when I remember to pack water. It folds away after our walk without taking over the whole bag." },
  ],
  "quick-dry-dog-towel": [
    { name: "Rina", dog: "Baxter", rating: 5, text: "Baxter believes every puddle is a spa. The towel is now the first thing I reach for when he comes back looking extremely pleased with himself." },
    { name: "Seth", dog: "Cleo", rating: 4, text: "Cleo is a champion swimmer and a very committed car-seat shaker. Keeping a towel by the door has made the post-beach routine much easier." },
  ],
  "portable-paw-cleaner": [
    { name: "Yara", dog: "Biscuit", rating: 5, text: "Biscuit's paws tell a detailed story about every trail we visit. A quick clean before the car saves me from learning the story twice." },
    { name: "Dev", dog: "Ollie", rating: 4, text: "Ollie finds the one muddy patch on an otherwise dry walk. This is handy to keep near the boot for the inevitable detour." },
  ],
  "portable-dog-water-bottle": [
    { name: "Luca", dog: "Mabel", rating: 5, text: "Mabel sets the pace, then remembers she is thirsty halfway up the hill. Having water ready has become part of our walk routine." },
    { name: "Sora", dog: "Benny", rating: 5, text: "Benny is a cheerful little walking companion with very specific hydration needs. This makes our longer outings easier to plan." },
  ],
  "reflective-walking-lead": [
    { name: "Faye", dog: "Rumi", rating: 5, text: "Rumi likes the quiet evening loop around the block. I appreciate the reflective detail as the light starts to fade." },
    { name: "Andre", dog: "Milo", rating: 4, text: "Milo has one more sniff in him after sunset, every single night. The extra reflective detail is a thoughtful addition to our walking kit." },
  ],
  "reusable-pet-hair-remover": [
    { name: "Noor", dog: "Tango", rating: 5, text: "Tango leaves fur wherever he has held a meeting with a cushion. It is nice having a reusable way to tidy up after his very busy schedule." },
    { name: "Callie", dog: "Raffi", rating: 4, text: "Raffi is generous with the fluff. I keep this nearby for the quick touch-up before people come over." },
  ],
};
const reviewCountBySlug: Record<string, number> = {
  "hard-bottom-back-seat-extender": 20,
  "waterproof-boot-liner-with-bumper-flap": 17,
  "foldable-dog-car-ramp": 12,
  "xl-hard-bottom-seat-extender": 8,
  "foldable-elevated-dog-camping-cot": 9,
  "washable-non-slip-extender-mat": 7,
  "spare-extender-strap-set": 2,
  "front-passenger-seat-protector": 6,
  "rear-door-protector-pair": 6,
  "cargo-sidewall-protector-pair": 5,
  "padded-back-seat-protector-without-rigid-base": 10,
  "headrest-storage-organiser": 3,
  "collapsible-water-bowl": 18,
  "quick-dry-dog-towel": 19,
  "reusable-pet-hair-remover": 11,
  "travel-pouch": 3,
  "portable-paw-cleaner": 15,
  "microfibre-drying-mitt-pair": 7,
  "dog-drying-robe": 12,
  "washable-car-detailing-cloth-set": 4,
  "portable-dog-water-bottle": 16,
  "collapsible-food-bowl": 8,
  "roll-top-kibble-bag": 7,
  "silicone-feeding-mat": 6,
  "insulated-dog-travel-tote": 5,
  "roll-up-padded-travel-bed": 9,
  "water-resistant-picnic-blanket": 7,
  "reflective-walking-lead": 13,
  "long-training-lead": 8,
  "treat-pouch-with-belt-clip": 11,
  "waste-bag-dispenser-with-starter-roll": 6,
  "waste-bag-refill-multipack": 4,
  "dog-travel-bundle": 7,
  "dog-travel-and-clean-up-bundle": 9,
  "full-car-protection-bundle": 10,
  "boot-and-bumper-bundle": 5,
  "suv-loading-bundle": 4,
  "xl-road-trip-bundle": 6,
  "weekend-camping-bundle": 8,
  "travel-feeding-pack": 7,
  "muddy-paws-clean-up-pack": 8,
  "walk-and-train-pack": 10,
  "holiday-road-trip-bundle": 0,
  "christmas-adventure-bundle": 0,
  "coastal-clean-up-bundle": 0,
};
const reviewFirstNames = ["Ari", "Blair", "Cleo", "Dara", "Emery", "Farah", "Glen", "Hallie", "Ira", "Jules", "Keira", "Logan", "Maren", "Nico", "Orla", "Parker", "Quinn", "Remy", "Shay", "Tobin", "Uma", "Vera", "Wren", "Xavier", "Yasmin", "Zain", "Amir", "Brielle", "Cyrus", "Delia"];
const reviewSurnames = ["Adler", "Bennett", "Chen", "Dawson", "Ellis", "Foster", "Garcia", "Hayes", "Ibrahim", "James", "Kim", "Lewis", "Morgan", "Nguyen", "Owens", "Patel", "Quinn", "Reed", "Singh", "Turner", "Usher", "Vaughn", "White", "Xu", "Young", "Zimmer", "Brooks", "Cruz", "Diaz", "Evans"];
const reviewDogNames = ["Bramble", "Coco", "Dobby", "Echo", "Figgy", "Gizmo", "Honey", "Indie", "Juno", "Koda", "Lenny", "Mochi", "Nugget", "Olive", "Pudding", "Raffi", "Suki", "Tango", "Umi", "Vinnie"];
const reviewCopy: Record<string, string[]> = {
  "Car travel": [
    "{dog} thinks every trip should start five minutes ago. We like having the {product} ready before the co-pilot starts the countdown.",
    "Our weekend walks often end with muddy paws and a very pleased dog. The {product} has made the car routine easier to manage.",
    "We keep the {product} with our car kit now. One less thing to remember while {dog} supervises the packing.",
    "The best part of a day out is getting home with {dog}. Having the {product} along makes the in-between bits feel calmer.",
    "{dog} has opinions about every car trip, mostly positive and very loud. The {product} has earned a regular place in our setup.",
    "A simple addition to our travel kit that gets used whenever {dog} comes along. The tail wag review was immediate.",
  ],
  Camping: [
    "{dog} appointed themself camp supervisor before we had finished unpacking. The {product} made our little setup feel more prepared.",
    "We took the {product} for a weekend away with {dog}. The best review is how quickly our resident explorer settled in.",
    "Our camp routine is now: unpack, make tea, locate {dog}. The {product} has found its place among the essentials.",
    "{dog} believes every campsite is a new kingdom. The {product} helped make our corner of it feel familiar.",
    "A handy bit of kit for weekends outside with {dog}. We packed it once and now it comes along by default.",
    "The {product} made our trip feel a little less like a packing puzzle. {dog} was mainly pleased about all the new smells.",
  ],
  "Food & water": [
    "{dog} has never forgotten snack time, even on a scenic drive. The {product} keeps one important member of the trip very happy.",
    "We brought the {product} along for a long walk with {dog}. It is now part of the regular grab-and-go pile by the door.",
    "A useful little helper for outings with {dog}. I can find what I need before the dramatic dinner-time stare begins.",
    "{dog} considers every pit stop a possible meal stop. The {product} makes it easier to keep the travel routine together.",
    "The {product} is easy to remember because {dog} reminds me if I forget. We have a very effective quality-control team.",
    "One less loose item rolling around the boot. {dog} approves of a better organised snack break.",
  ],
  "Clean-up": [
    "{dog} finds the mud; I find the {product}. It is a partnership with a surprisingly clear division of responsibilities.",
    "The post-walk shake is still part of {dog}'s routine. The {product} helps me get ahead of the splash zone.",
    "We keep the {product} close for the return from the park. {dog} gets the adventure, and the car gets a little less of it.",
    "{dog} came home looking like a very happy field researcher. The {product} is now an essential part of our clean-up plan.",
    "A practical helper for muddy paws and the cheerful chaos that follows. {dog} remains unapologetic.",
    "The {product} lives near the door now. That is where {dog} usually arrives with the next clean-up opportunity.",
  ],
  "Walks": [
    "{dog} treats every walk like an important research project. The {product} helps me keep up with the fieldwork.",
    "Our walks involve many stops, several sniffs and one very confident 'this way'. The {product} makes my side of the outing easier.",
    "{dog} knows exactly where the treats are now. I call that good training; {dog} calls it a sensible arrangement.",
    "We took the {product} on our usual loop and it has stayed in the walking kit since. {dog} is a creature of habit.",
    "A handy addition for strolls with {dog}, who believes a quick walk should include at least twelve scenic detours.",
    "{dog} gave the {product} a thorough sniff test. I appreciated having one less thing to juggle on our walk.",
  ],
  "Bundles": [
    "{dog} makes every outing an event. Having the {product} ready means less last-minute packing and more time for the event.",
    "We keep the {product} ready for weekends with {dog}. It has made our usual packing shuffle much simpler.",
    "{dog} packed three toys for a one-hour drive. At least the {product} keeps the practical bits in one place.",
    "A useful set for our trips with {dog}. The tail-wagging itinerary remains entirely outside my control.",
    "We took the {product} for a day out and came home with a happy, tired dog. That is our preferred kind of review.",
    "{dog} is the passenger; I am the logistics department. The {product} has helped the department run on time.",
  ],
};
function buildPreviewReviews(product: Product): Review[] {
  const count = reviewCountBySlug[product.slug] || 0;
  if (!count) return [];
  const productIndex = products.findIndex((item) => item.slug === product.slug);
  const crafted = [
    reviewSamples[product.slug],
    ...(popularProductReviewSamples[product.slug] || []),
  ].filter((review): review is Review => Boolean(review));
  const templates = reviewCopy[product.category] || reviewCopy.Bundles;
  return Array.from({ length: count }, (_, index) => {
    if (crafted[index]) return { ...crafted[index], sample: true };
    const identity = productIndex * 20 + index;
    const dog = reviewDogNames[identity % reviewDogNames.length];
    const sentence = templates[(productIndex + index) % templates.length]
      .replaceAll("{product}", product.name)
      .replaceAll("{dog}", dog);
    return {
      name: `${reviewFirstNames[identity % reviewFirstNames.length]} ${reviewSurnames[Math.floor(identity / reviewFirstNames.length)]}`,
      dog,
      rating: index % 6 === 0 ? 4 : 5,
      text: sentence,
      sample: true,
    };
  });
}

export default function Store({
  initialSlug,
  collection,
}: {
  initialSlug?: string;
  collection?: string;
}) {
  const {
    market,
    currency,
    selectMarket,
    minor,
    formatMinor,
    money,
  } = useCurrency();
  const reduced = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState(collection || "All products");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Featured");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [ready, setReady] = useState(false);
  const [bag, setBag] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [info, setInfo] = useState("");
  const [toast, setToast] = useState("");
  const [qty, setQty] = useState(1);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [checkoutSending, setCheckoutSending] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [orderReference, setOrderReference] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId | "">("");
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails>({
    name: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    region: "",
    postalCode: "",
    country: market,
  });
  const [customerReviews, setCustomerReviews] = useState<Record<string, Review[]>>({});
  const [reviewName, setReviewName] = useState("");
  const [reviewDog, setReviewDog] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [visibleReviewCount, setVisibleReviewCount] = useState(3);
  const selected = products.find((p) => p.slug === initialSlug);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("pob-reviews") || "{}");
      if (saved && typeof saved === "object") setCustomerReviews(saved);
    } catch {}
  }, []);
  useEffect(() => {
    setReviewMessage("");
    setVisibleReviewCount(3);
  }, [initialSlug]);
  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    const review: Review = {
      name: reviewName.trim(),
      dog: reviewDog.trim(),
      rating: reviewRating,
      text: reviewText.trim(),
    };
    const next = {
      ...customerReviews,
      [selected.slug]: [...(customerReviews[selected.slug] || []), review],
    };
    setCustomerReviews(next);
    try {
      localStorage.setItem("pob-reviews", JSON.stringify(next));
    } catch {}
    setReviewName("");
    setReviewDog("");
    setReviewRating(5);
    setReviewText("");
    setReviewMessage("Thanks for sharing your story. It is saved on this device.");
  };
  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!paymentMethod) {
      setCheckoutError("Choose a payment method to continue.");
      return;
    }
    setCheckoutSending(true);
    setCheckoutError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            ...checkoutDetails,
            country: markets[checkoutDetails.country].name,
          },
          paymentMethod,
          currency,
          displaySubtotal: formatMinor(total),
          items: products
            .filter((product) => cart[product.id])
            .map((product) => ({
              id: product.id,
              quantity: cart[product.id],
              displayUnitPrice: money(product.price),
            })),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not send your order.");
      setOrderReference(result.orderReference);
      setCheckoutComplete(true);
      setCart({});
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "We could not send your order. Please try again.",
      );
    } finally {
      setCheckoutSending(false);
    }
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setQuery(q);
    const cat = params.get("category");
    if (cat && categories.includes(cat)) setCategory(cat);
    try {
      const saved = JSON.parse(localStorage.getItem("pob-cart") || "{}");
      const clean: Record<string, number> = {};
      for (const p of products) {
        const n = Number(saved[p.id]);
        if (Number.isInteger(n) && n > 0) clean[p.id] = Math.min(99, n);
      }
      setCart(clean);
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem("pob-cart", JSON.stringify(cart));
  }, [cart, ready]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setBag(false);
        setInfo("");
        setMenu(false);
        setSearch(false);
      }
    };
    window.addEventListener("keydown", close);
    document.body.style.overflow = bag || info ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [bag, info]);
  useEffect(() => {
    if (reduced) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(
        ".section-heading,.collection-tile,.bundle-feature,.story",
      )
      .forEach((el) => {
        el.classList.add("reveal-ready");
        observer.observe(el);
      });
    return () => {
      observer.disconnect();
      document
        .querySelectorAll(".reveal-ready")
        .forEach((el) => el.classList.remove("reveal-ready"));
    };
  }, [reduced, collection]);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = products.reduce(
    (sum, p) => sum + minor(p.price) * (cart[p.id] || 0),
    0,
  );
  const separateMinor = (p: Product) =>
    p.items
      ? p.items.reduce(
          (sum, id) =>
            sum + minor(products.find((item) => item.id === id)!.price),
          0,
        )
      : minor(p.separate || p.price);
  const savingText = (p: Product) =>
    formatMinor(separateMinor(p) - minor(p.price));
  const percent = (p: Product) =>
    Math.round(((p.separate! - p.price) / p.separate!) * 100);
  function add(p: Product, n = 1) {
    setCart((c) => ({ ...c, [p.id]: Math.min(99, (c[p.id] || 0) + n) }));
    setToast(`${p.name} added to your bag`);
  }
  function change(id: number, delta: number) {
    setCart((c) => {
      const n = Math.min(99, (c[id] || 0) + delta);
      const next = { ...c };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });
  }
  function browse(cat: string) {
    const routes: Record<string, string> = {
      "All products": "/shop/",
      "Car travel": "/car-travel/",
      Bundles: "/bundles/",
    };
    window.location.href =
      routes[cat] || "/shop/?category=" + encodeURIComponent(cat);
  }
  function matches(p: Product, text: string) {
    const searchable = [
      p.name,
      p.category,
      ...(p.items || []).map(
        (id) => products.find((item) => item.id === id)!.name,
      ),
    ]
      .join(" ")
      .toLowerCase();
    return text
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .every((word) => searchable.includes(word));
  }
  const filtered = products
    .filter(
      (p) =>
        (category === "All products" || p.category === category) &&
        matches(p, query),
    )
    .sort((a, b) =>
      sort === "Price: low to high"
        ? a.price - b.price
        : sort === "Price: high to low"
          ? b.price - a.price
          : sort === "Name: A–Z"
            ? a.name.localeCompare(b.name)
            : 0,
    );
  function Card({ p }: { p: Product }) {
    return (
      <article className="product-card">
        <a href={"/products/" + p.slug + "/"} className="product-photo">
          {p.items ? (
            <div className="bundle-collage">
              {p.items.map((id) => {
                const item = products.find((x) => x.id === id)!;
                return (
                  <img
                    key={id}
                    src={item.image!}
                    alt={item.name}
                    loading="lazy"
                  />
                );
              })}
            </div>
          ) : p.image ? (
            <img src={p.image} alt={p.name} loading="lazy" />
          ) : (
            <div className="photo-pending">
              <Package size={44} />
              <span>Product photography coming soon</span>
            </div>
          )}
          {p.saving ? (
            <span className="label saving">
              Save {savingText(p)} · {percent(p)}%
            </span>
          ) : p.id === 1 ? (
            <span className="label">The road trip essential</span>
          ) : null}
          <span className="view-product">
            Take a closer look <ArrowUpRight size={17} />
          </span>
        </a>
        <div className="product-meta">
          <span>{p.category}</span>
          {p.items && <span>{p.items.length} essentials</span>}
        </div>
        <a className="product-name" href={"/products/" + p.slug + "/"}>
          {p.name}
        </a>
        <div className="product-bottom">
          <span className="price">
            {money(p.price)} <small>{currency}</small>
            {p.separate && <del>{formatMinor(separateMinor(p))}</del>}
          </span>
          <button
            className="add-btn"
            onClick={() => add(p)}
            aria-label={"Add " + p.name + " to bag"}
          >
            <Plus size={20} />
          </button>
        </div>
      </article>
    );
  }
  const catalogSection = (
    <section className="section shop relative" id="shop">
      <div className="section-heading">
        <div>
          <span className="eyebrow">PACKED WITH POSSIBILITIES</span>
          <h2>
            {collection
              ? category === "All products"
                ? "The whole collection."
                : category === "Car travel"
                  ? "For your favourite passenger."
                  : category === "Bundles"
                    ? "Good things, bundled."
                    : category
              : "A few favourites for the road."}
          </h2>
        </div>
        <p>Little essentials. Big days together.</p>
      </div>
      <div className="category-tabs">
        {categories.map((c, i) => {
          const Icon = icons[i];
          return (
            <button
              className={category === c ? "active" : ""}
              key={c}
              onClick={() => setCategory(c)}
            >
              <Icon size={16} />
              {c}
            </button>
          );
        })}
      </div>
      <div className="shop-toolbar">
        <span>
          {filtered.length} {category === "Bundles" ? "bundles" : "finds"} for
          your next adventure
        </span>
        <div>
          <label className="inline-search">
            <Search size={16} />
            <input
              aria-label="Filter products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find your gear"
            />
          </label>
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option>Featured</option>
            <option>Price: low to high</option>
            <option>Price: high to low</option>
            <option>Name: A–Z</option>
          </select>
        </div>
      </div>
      <div className="product-grid">
        {(collection ? filtered : filtered.slice(0, 8)).map((p) => (
          <Card p={p} key={p.id} />
        ))}
      </div>
      {!filtered.length && (
        <div className="empty">
          <Search size={40} />
          <h3>No gear found this time.</h3>
          <button
            className="text-link"
            onClick={() => {
              setQuery("");
              setCategory("All products");
            }}
          >
            Show all products <ArrowRight size={18} />
          </button>
        </div>
      )}
      {!collection && (
        <div className="shop-more">
          <a className="button dark" href="/shop/">
            Shop all {products.length} products & bundles{" "}
            <ArrowUpRight size={19} />
          </a>
        </div>
      )}
    </section>
  );
  const previewReviews: Review[] = selected ? buildPreviewReviews(selected) : [];
  const selectedReviews: Review[] = [
    ...(selected ? customerReviews[selected.slug] || [] : []),
    ...previewReviews,
  ];
  const reviewCount = selected ? reviewCountBySlug[selected.slug] || 0 : 0;
  const localReviewCount = selected
    ? customerReviews[selected.slug]?.length || 0
    : 0;
  const visibleReviews = selectedReviews.slice(0, visibleReviewCount);
  return (
    <>
      <div className="announcement">
        A little more adventure. A lot more tail wags.{" "}
        <span>
          Made for days together <PawPrint size={13} />
        </span>
      </div>
      <header>
        <a className="brand" href="/" aria-label="Paws on Board home">
          <PawPrint strokeWidth={2.5} />
          <span>paws on board</span>
        </a>
        <nav>
          <button onClick={() => browse("All products")}>Shop all</button>
          <button onClick={() => browse("Car travel")}>Car travel</button>
          <button onClick={() => browse("Bundles")}>
            Bundles <span className="nav-dot" />
          </button>
          <a href="/#our-story">Our story</a>
        </nav>
        <div className="header-tools">
          <label className="market-picker">
            <span className="sr-only">Country and currency</span>
            <select
              aria-label="Country and currency"
              value={market}
              onChange={(e) => selectMarket(e.target.value as Market)}
            >
              {Object.entries(markets).map(([key, m]) => (
                <option key={key} value={key}>
                  {m.name} · {m.currency}
                </option>
              ))}
            </select>
          </label>
          <button
            aria-label="Search products"
            onClick={() => setSearch(!search)}
          >
            <Search size={21} />
          </button>
          <button
            className="bag-icon"
            aria-label={"Open shopping bag, " + count + " items"}
            onClick={() => setBag(true)}
          >
            <ShoppingBag size={21} />
            <span>{count}</span>
          </button>
          <button
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMenu(!menu)}
          >
            <Menu />
          </button>
        </div>
      </header>
      {menu && (
        <div className="mobile-nav">
          {categories.map((c) => (
            <button key={c} onClick={() => browse(c)}>
              {c}
              <ArrowUpRight size={18} />
            </button>
          ))}
        </div>
      )}
      {search && (
        <div className="search-panel">
          <form className="search-bar" action="/shop/" method="get">
            <Search size={20} />
            <input
              autoFocus
              name="q"
              aria-label="Search the catalogue"
              placeholder="Search products, bundles or essentials…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-submit">
              Search <ArrowRight size={17} />
            </button>
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearch(false)}
            >
              <X />
            </button>
          </form>
          {searchQuery.trim() && (
            <div className="search-suggestions">
              {products
                .filter((p) => matches(p, searchQuery))
                .slice(0, 5)
                .map((p) => (
                  <a key={p.id} href={"/products/" + p.slug + "/"}>
                    <img src={p.image!} alt="" />
                    <span>{p.name}</span>
                    <strong>
                      {money(p.price)} {currency}
                    </strong>
                    <ArrowUpRight size={17} />
                  </a>
                ))}
              {!products.some((p) => matches(p, searchQuery)) && (
                <p>No matching products. Try “extender”, “bowl” or “bundle”.</p>
              )}
            </div>
          )}
        </div>
      )}
      {selected ? (
        <main className="detail">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <a href="/shop/">Shop</a>
            <span>/</span>
            {selected.name}
          </div>
          <div className="detail-grid">
            <div className="detail-photo">
              {selected.items ? (
                <div className="bundle-collage detail-collage">
                  {selected.items.map((id) => {
                    const item = products.find((x) => x.id === id)!;
                    return <img key={id} src={item.image!} alt={item.name} />;
                  })}
                </div>
              ) : selected.image ? (
                <img src={selected.image} alt={selected.name} />
              ) : (
                <div className="photo-pending">
                  <Package size={70} />
                  <span>Product photography coming soon</span>
                </div>
              )}
            </div>
            <div className="detail-copy">
              <span className="eyebrow">{selected.category}</span>
              <h1>{selected.name}</h1>
              <div className="detail-price">
                {money(selected.price)} <small>{currency}</small>
                {selected.separate && (
                  <del>{formatMinor(separateMinor(selected))}</del>
                )}
                {selected.saving && (
                  <span className="label saving">
                    Save {savingText(selected)} · {percent(selected)}%
                  </span>
                )}
              </div>
              {selected.items && (
                <div className="savings-breakdown">
                  <div>
                    <span>Items bought separately</span>
                    <span>
                      {formatMinor(separateMinor(selected))} {currency}
                    </span>
                  </div>
                  <div>
                    <strong>Bundle price</strong>
                    <strong>
                      {money(selected.price)} {currency}
                    </strong>
                  </div>
                  <div className="savings-line">
                    <Check size={17} />
                    <span>
                      You save {savingText(selected)} ({percent(selected)}%)
                    </span>
                  </div>
                  <small>
                    {selected.phase === "Proposed holiday offer"
                      ? "Proposed holiday bundle offer. "
                      : ""}
                    Compared with the current individual item prices. No code
                    needed.
                  </small>
                </div>
              )}
              <p>{descriptions[selected.category]}</p>
              {selected.id === 1 && (
                <p>
                  A foldable rigid base bridges the rear footwell to create a
                  flatter surface. The wipe-clean cover and side flaps help
                  protect your car’s interior.
                </p>
              )}
              {selected.items && (
                <div className="included">
                  <h3>Inside your bundle</h3>
                  {selected.items.map((id) => {
                    const p = products.find((p) => p.id === id)!;
                    return (
                      <a key={id} href={"/products/" + p.slug + "/"}>
                        <Check size={16} />
                        <span>{p.name}</span>
                        <span>{money(p.price)}</span>
                      </a>
                    );
                  })}
                </div>
              )}
              <div className="purchase">
                <div className="quantity">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                  >
                    <Minus size={16} />
                  </button>
                  <span>{qty}</span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => setQty(Math.min(99, qty + 1))}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  className="button dark"
                  onClick={() => add(selected, qty)}
                >
                  Add to bag <ShoppingBag size={18} />
                </button>
              </div>
              <p className="preview-note">
                Catalogue preview · Proposed pricing. Payment details and
                delivery will be confirmed privately by email.
              </p>
              <details open>
                <summary>
                  Details & fit <ChevronDown size={16} />
                </summary>
                <p>{productDetails[selected.slug]}</p>
              </details>
              <details>
                <summary>
                  Delivery & returns <ChevronDown size={16} />
                </summary>
                <p>
                  Australian delivery rates, dispatch times and return terms are
                  being finalised and will be shown before payment becomes
                  available.
                </p>
              </details>
            </div>
          </div>
          <section className="reviews" aria-labelledby="reviews-heading">
            <div className="reviews-heading">
              <div>
                <span className="eyebrow">Notes from the pack</span>
                <h2 id="reviews-heading">The good word on {selected.name}.</h2>
                <p>Stories from people and their very opinionated co-pilots.</p>
                <p className="review-milestone">Since 2025, we have made 900+ deliveries for dogs and their people.</p>
              </div>
              <div className="review-score">
                <strong>{reviewCount.toLocaleString()}</strong>
                <small>illustrative reviews</small>
                {localReviewCount > 0 && (
                  <small className="review-local-count">
                    {localReviewCount} saved here
                  </small>
                )}
              </div>
            </div>
            <p className="review-disclaimer">
              Example names, stories and review counts are illustrative previews, not customer submissions. Reviews you add are saved only in this browser.
            </p>
            <div className="review-grid">
              {visibleReviews.map((review, index) => (
                  <article className="review-card" key={`${review.name}-${index}`}>
                    <div className="review-card-top">
                      <div className={`review-avatar review-avatar-${(index % 3) + 1}`} aria-hidden="true">
                        {review.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="reviewer">
                        <strong>{review.name}{review.dog ? ` & ${review.dog}` : ""}</strong>
                        <span>{review.sample ? "Example reviewer" : "Customer review · saved here"}</span>
                      </div>
                      <span className="review-paw" aria-hidden="true">🐾</span>
                    </div>
                    <div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, star) => (
                        <span key={star}>{star < review.rating ? "★" : "☆"}</span>
                      ))}
                    </div>
                    <p>“{review.text}”</p>
                    <span className="review-tag">{review.sample ? "Example story" : "Customer review"}</span>
                  </article>
                ))}
              {!selectedReviews.length && (
                <p className="no-reviews">No reviews yet. Be the first to leave one.</p>
              )}
            </div>
            {selectedReviews.length > 0 && (
              <div className="review-list-controls">
                <span>Showing {visibleReviews.length} of {selectedReviews.length} reviews</span>
                {visibleReviewCount < selectedReviews.length && (
                  <button type="button" onClick={() => setVisibleReviewCount((count) => count + 3)}>
                    Show more reviews <ArrowRight size={16} />
                  </button>
                )}
                {visibleReviewCount > 3 && (
                  <button type="button" onClick={() => setVisibleReviewCount(3)}>
                    Show fewer
                  </button>
                )}
              </div>
            )}
            <form className="review-form" onSubmit={submitReview}>
              <div className="review-form-heading">
                <span className="eyebrow">Your turn</span>
                <h3>Share your story.</h3>
                <p>Tell other dog people what you think about {selected.name}.</p>
              </div>
              <div className="review-form-fields">
                <label>
                  <span className="review-field-label">Your name</span>
                  <input value={reviewName} onChange={(event) => setReviewName(event.target.value)} required maxLength={60} placeholder="e.g. Taylor" />
                </label>
                <label>
                  <span className="review-field-label">Your dog's name <small>(optional)</small></span>
                  <input value={reviewDog} onChange={(event) => setReviewDog(event.target.value)} maxLength={40} placeholder="e.g. Sunny" />
                </label>
                <label>
                  <span className="review-field-label">Your rating</span>
                  <select value={reviewRating} onChange={(event) => setReviewRating(Number(event.target.value))}>
                    <option value={5}>5 stars — Loved it</option>
                    <option value={4}>4 stars — Really good</option>
                    <option value={3}>3 stars — It was okay</option>
                    <option value={2}>2 stars — Could be better</option>
                    <option value={1}>1 star — Not for us</option>
                  </select>
                </label>
                <label className="review-form-story">
                  <span className="review-field-label">Your review</span>
                  <textarea value={reviewText} onChange={(event) => setReviewText(event.target.value)} required minLength={8} maxLength={1200} rows={4} placeholder="How did it fit into life with your dog?" />
                </label>
              </div>
              <div className="review-form-bottom">
                <small>Your feedback matters.</small>
                <button className="button dark" type="submit">Post review <ArrowUpRight size={17} /></button>
              </div>
              {reviewMessage && <p className="review-success" role="status">{reviewMessage}</p>}
            </form>
          </section>
          <section className="related">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Better together</span>
                <h2>A few good companions.</h2>
              </div>
              <a href="/shop/">
                Explore the collection <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="product-grid">
              {products
                .filter(
                  (p) =>
                    p.id !== selected.id && p.category === selected.category,
                )
                .slice(0, 4)
                .map((p) => (
                  <Card key={p.id} p={p} />
                ))}
            </div>
          </section>
        </main>
      ) : collection ? (
        <main className="collection-page">
          <section
            className={
              "collection-banner " +
              (collection === "Car travel" ? "car-banner" : "")
            }
          >
            <div>
              <a className="breadcrumb" href="/">
                Home / {collection === "All products" ? "Shop all" : collection}
              </a>
              <span className="eyebrow">
                {collection === "Car travel"
                  ? "THE JOURNEY IS HALF THE FUN"
                  : "THE PAWS ON BOARD COLLECTION"}
              </span>
              <h1>
                {collection === "Car travel" ? (
                  <>
                    The best seat.
                    <br />
                    <em>The best company.</em>
                  </>
                ) : collection === "Bundles" ? (
                  <>
                    Pack together.
                    <br />
                    <em>Save together.</em>
                  </>
                ) : (
                  <>
                    Every essential.
                    <br />
                    <em>Every adventure.</em>
                  </>
                )}
              </h1>
              <p>
                {collection === "Car travel"
                  ? "Seat extenders, boot liners and clever extras. Make room for the passenger who’s always ready to go."
                  : collection === "Bundles"
                    ? "Explore everyday bundles and our holiday edit, with every item and every saving clearly shown."
                    : "Explore all 32 individual products and 13 bundles, from the daily park run to the holiday road trip."}
              </p>
            </div>
            <img
              src={
                collection === "Car travel"
                  ? "/images/hero.jpg"
                  : collection === "Bundles"
                    ? "/images/holiday-dogs.jpg"
                    : "/images/christmas.jpg"
              }
              alt={
                collection === "Car travel"
                  ? "Dog in a protected back seat"
                  : "A dog enjoying the festive season"
              }
            />
          </section>
          {catalogSection}
          {collection === "Car travel" && (
            <section className="section car-bundles">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">COMPLETE YOUR CAR KIT</span>
                  <h2>Ready for the whole trip.</h2>
                </div>
                <a href="/bundles/">
                  All bundles <ArrowUpRight size={18} />
                </a>
              </div>
              <div className="product-grid">
                {products
                  .filter((p) => [101, 103, 105, 111].includes(p.id))
                  .map((p) => (
                    <Card key={p.id} p={p} />
                  ))}
              </div>
            </section>
          )}
          {collection === "Bundles" && (
            <HolidayCarousel
              money={money}
              currency={currency}
              saving={(id) => savingText(products.find((p) => p.id === id)!)}
            />
          )}
        </main>
      ) : (
        <main>
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow">
                <span className="tiny-line" /> FOR THE LOVE OF GOING TOGETHER
              </span>
              <h1>
                Good days.
                <br />
                Great company.
                <br />
                <em>Paws on board.</em>
              </h1>
              <p>
                From the morning park run to the long way home.
                <br className="desktop-break" /> Thoughtful travel gear for you
                and your favourite passenger.
              </p>
              <div className="hero-actions">
                <button
                  className="button orange"
                  onClick={() => browse("All products")}
                >
                  Find your next adventure <ArrowUpRight size={19} />
                </button>
                <button className="text-link" onClick={() => browse("Bundles")}>
                  Explore bundles <ArrowRight size={17} />
                </button>
              </div>
              <div className="hero-foot">
                <PawPrint size={23} />
                <span>
                  For muddy paws, sandy seats
                  <br />
                  and the memories in between.
                </span>
              </div>
            </div>
            <div className="hero-image">
              <img
                src="/images/hero.jpg"
                alt="Golden retriever relaxing on a back-seat extender"
                fetchPriority="high"
              />
              <div className="round-stamp">
                MORE WAGS
                <br />
                <PawPrint size={27} />
                <br />
                MORE WEEKENDS
              </div>
              <a
                className="hero-caption"
                href="/products/hard-bottom-back-seat-extender/"
              >
                <span>
                  <small>MEET YOUR NEW TRAVEL ESSENTIAL</small>
                  <strong>The Back-Seat Extender</strong>
                </span>
                <span className="caption-arrow">
                  <ArrowUpRight size={25} />
                </span>
              </a>
            </div>
          </section>
          <div className="value-strip">
            <span>
              <Car size={21} /> A place for your co-pilot
            </span>
            <span>
              <Tent size={21} /> Ready for the great outdoors
            </span>
            <span>
              <Droplets size={21} /> Less mess after the fun
            </span>
            <span>
              <Package size={21} /> Good things, bundled
            </span>
          </div>
          <HolidayCarousel
            money={money}
            currency={currency}
            saving={(id) => savingText(products.find((p) => p.id === id)!)}
          />
          <section className="section collections relative">
            <div className="section-heading">
              <div>
                <span className="eyebrow">WHERE ARE WE HEADING?</span>
                <h2>Every kind of adventure.</h2>
              </div>
              <button
                className="text-link"
                onClick={() => browse("All products")}
              >
                Shop the whole collection <ArrowUpRight size={19} />
              </button>
            </div>
            <div className="collection-grid">
              {[
                {
                  cat: "Car travel",
                  title: "The best seat in the car.",
                  img: "/images/hero.jpg",
                  sub: "CAR TRAVEL",
                },
                {
                  cat: "Camping",
                  title: "Take the scenic route.",
                  img: "/images/product-5.jpg",
                  sub: "CAMPING & OUTDOORS",
                },
                {
                  cat: "Clean-up",
                  title: "Bring the fun. Leave the mud.",
                  img: "/images/product-17.jpg",
                  sub: "CLEAN-UP ESSENTIALS",
                },
              ].map((c) => (
                <button
                  key={c.cat}
                  onClick={() => browse(c.cat)}
                  className={
                    "collection-tile " + c.cat.toLowerCase().replace("-", "")
                  }
                >
                  <img src={c.img} alt={c.cat + " essentials"} loading="lazy" />
                  <div>
                    <span>{c.sub}</span>
                    <h3>{c.title}</h3>
                  </div>
                  <span className="collection-arrow">
                    <ArrowUpRight />
                  </span>
                </button>
              ))}
            </div>
          </section>
          <section className="bundle-feature">
            <div className="bundle-photo">
              <img
                src="/images/extender.jpg"
                alt="Hard-bottom back-seat extender"
                loading="lazy"
              />
              <span className="bundle-sticker">
                A GOOD TRIP
                <br />
                STARTS HERE <PawPrint size={24} />
              </span>
              <div className="bundle-insets">
                <img
                  src="/images/product-13.jpg"
                  alt="Collapsible travel bowl"
                />
                <span>+</span>
                <img src="/images/product-14.jpg" alt="Quick-dry towel" />
              </div>
            </div>
            <div className="bundle-copy">
              <span className="eyebrow">PACK LESS. DO MORE.</span>
              <h2>
                The ride.
                <br />
                The refresh.
                <br />
                <em>The ready-for-anything.</em>
              </h2>
              <p>
                The Dog Travel Bundle brings your back-seat extender,
                collapsible bowl and quick-dry towel together. Three essentials.
                One very happy co-pilot.
              </p>
              <div className="bundle-price">
                <strong>{money(179)}</strong>
                <small>{currency}</small>
                <del>
                  {formatMinor(
                    separateMinor(products.find((p) => p.id === 101)!),
                  )}
                </del>
                <span>
                  Save {savingText(products.find((p) => p.id === 101)!)} · 5%
                </span>
              </div>
              <a className="button dark" href="/products/dog-travel-bundle/">
                Meet your travel bundle <ArrowUpRight size={20} />
              </a>
            </div>
          </section>
          {catalogSection}
          <AdventureVideo />
          <section className="story" id="our-story">
            <div>
              <span className="eyebrow">OUR KIND OF COMPANY</span>
              <h2>
                Life’s better
                <br />
                with a little
                <br />
                <em>dog hair in it.</em>
              </h2>
            </div>
            <div>
              <PawPrint size={45} strokeWidth={1.4} />
              <p>
                We’re building Paws on Board around a simple idea. The best part
                of going somewhere is who you bring along.
              </p>
              <p>
                Our collection brings together practical car protection, outdoor
                comfort and everyday essentials for dog owners in Australia.
                More time exploring. More time together.
              </p>
              <p>Since 2025, we have made 900+ deliveries for dogs and their people.</p>
              <button
                className="text-link"
                onClick={() => browse("All products")}
              >
                Make room for your next adventure <ArrowUpRight size={20} />
              </button>
            </div>
          </section>
          <section className="section faq">
            <div>
              <span className="eyebrow">BEFORE YOU HIT THE ROAD</span>
              <h2>
                A few things
                <br />
                you might ask.
              </h2>
            </div>
            <div>
              {[
                [
                  "Will the extender fit my car?",
                  "Check your rear seat width, depth and footwell space. We’ll publish exact dimensions and tested vehicle examples before orders open.",
                ],
                [
                  "What comes in a bundle?",
                  "Each bundle includes one retail unit of every listed item. Open a bundle page to see its full contents, individual prices and combined saving.",
                ],
                [
                  "Can I order yet?",
                  "You can submit an unpaid order request from your bag. We will confirm delivery and email payment instructions privately before taking payment.",
                ],
                [
                  "Can I shop in my currency?",
                  "Choose Australia (AUD), USA (USD) or Canada (CAD) in the header. AUD is the base price. Converted prices use dated reference exchange rates, with a saved rate if the service is unavailable. Final payment and shipping availability will be confirmed before launch.",
                ],
              ].map(([q, a]) => (
                <details key={q}>
                  <summary>
                    {q}
                    <Plus size={18} />
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </section>
        </main>
      )}
      <footer>
        <div className="footer-top">
          <div>
            <a className="brand" href="/">
              <PawPrint />
              <span>paws on board</span>
            </a>
            <p>Good days start together.</p>
          </div>
          <div>
            <h4>Find your gear</h4>
            <button onClick={() => browse("Car travel")}>Car travel</button>
            <button onClick={() => browse("Camping")}>
              Camping & outdoors
            </button>
            <button onClick={() => browse("Bundles")}>Bundles & packs</button>
          </div>
          <div>
            <h4>A little help</h4>
            <button onClick={() => setInfo("Fit guide")}>
              Vehicle fit guide
            </button>
            <a className="footer-link" href="/shipping-delivery/">
              Delivery & returns
            </a>
            <a className="footer-link" href="/terms/">Terms of use</a>
            <a className="footer-link" href="/privacy/">Privacy policy</a>
            <button onClick={() => setInfo("About this preview")}>
              About this preview
            </button>
          </div>
          <div className="footer-signoff">
            <span>SEE YOU OUT THERE.</span>
            <PawPrint size={65} strokeWidth={1} />
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Paws on Board</span>
          <span>
            {markets[market].name} · {currency}
          </span>
          <span>Order requests by email · Private payment instructions</span>
        </div>
        <div className="payment-strip" aria-label="Payment methods accepted">
          <PaymentLogo method="zelle" />
          <PaymentLogo method="paypal" />
          <PaymentLogo method="applepay" />
          <PaymentLogo method="bank" />
          <PaymentLogo method="chime" />
        </div>
      </footer>
      {toast && (
        <div role="status" className="toast">
          <Check size={18} />
          {toast}
          <button
            onClick={() => {
              setBag(true);
              setToast("");
            }}
          >
            View bag
          </button>
        </div>
      )}
      {bag && (
        <div className="overlay" onClick={() => setBag(false)}>
          <aside
            className="cart"
            role="dialog"
            aria-modal="true"
            aria-label="Your shopping bag"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cart-heading">
              <h2>
                {checkoutComplete
                  ? "Order request sent"
                  : checkoutOpen
                    ? "Checkout"
                    : <>Your adventure bag <span>({count})</span></>}
              </h2>
              {checkoutOpen && !checkoutComplete && (
                <button className="back-to-bag" onClick={() => setCheckoutOpen(false)}>
                  Back to bag
                </button>
              )}
              <button aria-label="Close bag" onClick={() => { setBag(false); setCheckoutOpen(false); setCheckoutComplete(false); }}>
                <X />
              </button>
            </div>
            {checkoutComplete ? (
              <div className="order-confirmation">
                <Check size={42} />
                <span className="eyebrow">THANK YOU</span>
                <h3>Your order request is on its way.</h3>
                <p>Reference {orderReference}. We will email you privately with payment instructions for your selected method.</p>
                <p className="order-confirmation-note">No payment has been taken. Delivery and final order details will be confirmed by email.</p>
                <button className="button dark" onClick={() => { setBag(false); setCheckoutOpen(false); setCheckoutComplete(false); }}>
                  Keep exploring <ArrowRight size={18} />
                </button>
              </div>
            ) : checkoutOpen ? (
              <form className="checkout-form" onSubmit={submitOrder}>
                <div className="checkout-scroll">
                  <p className="checkout-intro">Add your contact and delivery details, then choose how you prefer to pay. We will email payment instructions privately after reviewing the order.</p>
                  <div className="checkout-fields">
                    <label className="checkout-field full">
                      Full name
                      <input required autoComplete="name" value={checkoutDetails.name} onChange={(event) => setCheckoutDetails({ ...checkoutDetails, name: event.target.value })} />
                    </label>
                    <label className="checkout-field">
                      Email address
                      <input required type="email" autoComplete="email" value={checkoutDetails.email} onChange={(event) => setCheckoutDetails({ ...checkoutDetails, email: event.target.value })} />
                    </label>
                    <label className="checkout-field">
                      Phone number
                      <input required type="tel" autoComplete="tel" value={checkoutDetails.phone} onChange={(event) => setCheckoutDetails({ ...checkoutDetails, phone: event.target.value })} />
                    </label>
                    <label className="checkout-field full">
                      Street address
                      <input required autoComplete="address-line1" value={checkoutDetails.address} onChange={(event) => setCheckoutDetails({ ...checkoutDetails, address: event.target.value })} />
                    </label>
                    <label className="checkout-field full">
                      Apartment, suite, etc. <span>(optional)</span>
                      <input autoComplete="address-line2" value={checkoutDetails.apartment} onChange={(event) => setCheckoutDetails({ ...checkoutDetails, apartment: event.target.value })} />
                    </label>
                    <label className="checkout-field">
                      City or town
                      <input required autoComplete="address-level2" value={checkoutDetails.city} onChange={(event) => setCheckoutDetails({ ...checkoutDetails, city: event.target.value })} />
                    </label>
                    <label className="checkout-field">
                      State or province
                      <input required autoComplete="address-level1" value={checkoutDetails.region} onChange={(event) => setCheckoutDetails({ ...checkoutDetails, region: event.target.value })} />
                    </label>
                    <label className="checkout-field">
                      Postal code
                      <input required autoComplete="postal-code" value={checkoutDetails.postalCode} onChange={(event) => setCheckoutDetails({ ...checkoutDetails, postalCode: event.target.value })} />
                    </label>
                    <label className="checkout-field">
                      Country
                      <select value={checkoutDetails.country} onChange={(event) => {
                        const country = event.target.value as Market;
                        setCheckoutDetails({ ...checkoutDetails, country });
                        selectMarket(country);
                      }}>
                        {Object.entries(markets).map(([key, value]) => <option key={key} value={key}>{value.name}</option>)}
                      </select>
                    </label>
                  </div>
                  <fieldset className="payment-options">
                    <legend>Choose a payment method</legend>
                    {paymentMethods.map((payment) => (
                      <label className={"payment-option " + (paymentMethod === payment.id ? "selected" : "")} key={payment.id}>
                        <input type="radio" name="paymentMethod" value={payment.id} checked={paymentMethod === payment.id} onChange={() => setPaymentMethod(payment.id)} required />
                        <span className="payment-option-content">
                          <PaymentLogo method={payment.id} />
                          <span>{payment.detail}</span>
                        </span>
                      </label>
                    ))}
                  </fieldset>
                  <div className="checkout-summary">
                    <div><span>Subtotal</span><strong>{formatMinor(total)} {currency}</strong></div>
                    <p>Delivery cost and availability will be confirmed by email before payment.</p>
                  </div>
                </div>
                {checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}
                <div className="checkout-submit">
                  <button className="button dark" type="submit" disabled={checkoutSending || !count}>
                    {checkoutSending ? "Sending order…" : "Send order request"} <ArrowRight size={18} />
                  </button>
                  <small>No payment is taken on this step.</small>
                </div>
              </form>
            ) : count ? (
              <>
                <div className="cart-items">
                  {products
                    .filter((p) => cart[p.id])
                    .map((p) => (
                      <div key={p.id} className="cart-item">
                        {p.image ? (
                          <img src={p.image} alt={p.name} />
                        ) : (
                          <Package size={50} />
                        )}
                        <div>
                          <a href={"/products/" + p.slug + "/"}>{p.name}</a>
                          <small>
                            {money(p.price)} {currency} each
                          </small>
                          <div className="quantity">
                            <button
                              aria-label={"Decrease " + p.name}
                              onClick={() => change(p.id, -1)}
                            >
                              <Minus size={14} />
                            </button>
                            <span>{cart[p.id]}</span>
                            <button
                              aria-label={"Increase " + p.name}
                              onClick={() => change(p.id, 1)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <strong>
                          {formatMinor(minor(p.price) * cart[p.id])}
                        </strong>
                      </div>
                    ))}
                </div>
                <div className="cart-total">
                  <div>
                    <span>Subtotal</span>
                    <strong>
                      {formatMinor(total)} {currency}
                    </strong>
                  </div>
                  <p>
                    Delivery cost and availability will be confirmed by email
                    before payment.
                  </p>
                  <button
                    className="button dark"
                    onClick={() => {
                      setCheckoutOpen(true);
                      setCheckoutComplete(false);
                      setPaymentMethod("");
                      setCheckoutError("");
                      setCheckoutDetails({
                        ...checkoutDetails,
                        country: market,
                      });
                    }}
                  >
                    Continue to checkout <ArrowRight size={18} />
                  </button>
                  <small>Your bag is saved on this device.</small>
                </div>
              </>
            ) : (
              <div className="empty">
                <ShoppingBag size={50} />
                <h3>Your next adventure starts here.</h3>
                <p>A little room for something good.</p>
                <button
                  className="button dark"
                  onClick={() => {
                    setBag(false);
                    browse("All products");
                  }}
                >
                  Explore the collection <ArrowRight size={18} />
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
      {info && (
        <div className="overlay modal-overlay" onClick={() => setInfo("")}>
          <div
            className="info-modal"
            role="dialog"
            aria-modal="true"
            aria-label={info}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal"
              aria-label="Close information"
              onClick={() => setInfo("")}
            >
              <X />
            </button>
            <span className="eyebrow">PAWS ON BOARD</span>
            <h2>{info}</h2>
            {info === "Fit guide" ? (
              <>
                <p>
                  Measure the width and depth of your rear seat, plus the gap
                  between the rear and front seats. For boot liners, measure the
                  boot floor and sidewalls.
                </p>
                <p>
                  Compare these measurements with confirmed supplier dimensions
                  before purchase. The catalogue’s exact sizes and tested
                  vehicle list are still to be added.
                </p>
              </>
            ) : info === "Delivery & returns" ? (
              <p>
                Delivery availability in Australia, the USA and Canada, rates,
                dispatch locations, estimated delivery times and return terms
                are being finalised. These details will be available before
                orders open.
              </p>
            ) : (
              <>
                <p>
                  This is the first Paws on Board catalogue, with 32 individual
                  products and 13 bundles, including three proposed holiday
                  packs. Prices are proposals for launch.
                </p>
                <p>
                  Checkout emails your unpaid order request to the shop. Payment
                  instructions, delivery costs and fulfilment are confirmed by
                  email; no payment is taken on the website.
                </p>
              </>
            )}
            <button className="button dark" onClick={() => setInfo("")}>
              Keep exploring <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
