"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const TrashBox = () => {
	const router = useRouter();
	const params = useParams();
	const documents = useQuery(api.documents.getTrash);
	const restore = useMutation(api.documents.restore);
	const remove = useMutation(api.documents.remove);

	const [search, setSearch] = useState<string>("");

	const filteredDocuments = documents?.filter((document) =>
		document.title.toLowerCase().includes(search.toLowerCase())
	);

	const onClick = (documentId: string) => {
		router.push(`/documents/${documentId}`);
	};

	const onRestore = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		id: Id<"documents">
	) => {
		event.stopPropagation();

		const promise = restore({ id });

		toast.promise(promise, {
			loading: "Restoring node...",
			success: "Node is restored!",
			error: "Failed to restore node.",
		});
	};

	const onRemove = (id: Id<"documents">) => {
		const promise = remove({ id });

		toast.promise(promise, {
			loading: "Removing node...",
			success: "Node is removed!",
			error: "Failed to remove node.",
		});

		if (params?.documentId === id) {
			router.push(`/documents`);
		}
	};

	if (documents === undefined) {
		return (
			<div className="h-full flex items-center justify-center p-4">
				<Spinner size="large" />
			</div>
		);
	}

	return (
		<div className="text-sm">
			<div className="flex items-center gap-x-1 p-2">
				<Search className="h-4 w-4" />
				<Input
					className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
					value={search}
					placeholder="Filter by page title"
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>
			<div className="mt-2 px-1 pb-1">
				<p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
					No Documents found.
				</p>
				{filteredDocuments?.map((document) => (
					<div
						key={document._id}
						className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
						role="button"
						onClick={() => onClick(document._id)}
					>
						<span className="truncate pl-2">{document.title}</span>
						<div className="flex items-center mr-2">
							<div
								className="rounded-lg p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
								role="button"
								onClick={(e) => onRestore(e, document._id)}
							>
								<Undo className="h-4 w-4 text-muted-foreground" />
							</div>
							<ConfirmModal
								onConfirm={() => onRemove(document._id)}
							>
								<div
									className="rounded-lg p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
									role="button"
								>
									<Trash className="h-4 w-4 text-muted-foreground" />
								</div>
							</ConfirmModal>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
