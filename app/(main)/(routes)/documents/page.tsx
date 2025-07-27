"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function DocumentsPage() {
	const { user } = useUser();
	const create = useMutation(api.documents.create);

	const onCreate = () => {
		const createPromise = create({ title: "untitled" });

		toast.promise(createPromise, {
			loading: "Creating a new node...",
			success: "New node created!",
			error: "Failed to create node.",
		});
	};

	return (
		<div className="h-full flex flex-col items-center justify-center space-y-4">
			<Image
				src="/empty.png"
				height="300"
				width="300"
				alt="Empty Documents"
				className="dark:hidden"
			/>
			<Image
				src="/empty-dark.png"
				height="300"
				width="300"
				alt="Empty Documents"
				className="hidden dark:block"
			/>
			<h2 className="text-lg font-medium">
				Welcome to <i>{user?.firstName}&apos;s</i> FocusNode
			</h2>
			<Button onClick={onCreate}>
				<PlusCircle className="h-4 w-4 mr-2" />
				Create a note
			</Button>
		</div>
	);
}
