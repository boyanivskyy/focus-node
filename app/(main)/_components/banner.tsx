"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useRouter } from "next/navigation";

interface BannerProps {
	documentId: Id<"documents">;
}

export const Banner = ({ documentId }: BannerProps) => {
	const router = useRouter();

	const remove = useMutation(api.documents.remove);
	const restore = useMutation(api.documents.restore);

	const onRemove = () => {
		const promise = remove({ id: documentId });

		toast.promise(promise, {
			loading: "Removing node...",
			success: "Node is removed!",
			error: "Failed to remove node.",
		});

		router.push("/documents");
	};

	const onRestore = () => {
		const promise = restore({
			id: documentId,
		});

		toast.promise(promise, {
			loading: "Restoring node...",
			success: "Node is restored!",
			error: "Failed to restore node.",
		});
	};

	return (
		<div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
			<p>This page is in the Trash Box.</p>
			<Button
				size="sm"
				variant="outline"
				className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
				onClick={onRestore}
			>
				Restore page
			</Button>
			<ConfirmModal onConfirm={onRemove}>
				<Button
					size="sm"
					variant="outline"
					className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
				>
					Delete forever
				</Button>
			</ConfirmModal>
		</div>
	);
};
