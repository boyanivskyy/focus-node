import { Heroes } from "./_components/heroes";
import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";

export default function MarketingPage() {
	return (
		<div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
			<div
				className="flex flex-col items-center justify-center
      md:justify-start text-center gap-y-8 flex-1 px-6 pb-10"
			>
				<Heading />
				<Heroes />
			</div>
			<Footer />
		</div>
	);
}
