"use client";

import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Navigation } from "./_components/navigation";
import { SearchCommand } from "@/components/search-command";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAuthenticated, isLoading } = useConvexAuth();

	if (isLoading) {
		return (
			<div className="h-full flex items-center justify-center">
				<Spinner size="large" />
			</div>
		);
	}

	if (!isAuthenticated) {
		return redirect("/");
	}

	return (
		<div className="h-full flex dark:bg-[#1F1F1F]">
			<Navigation />
			<main className="flex-1 h-full overflow-y-auto">
				<SearchCommand />
				{children}
			</main>
		</div>
	);
}
