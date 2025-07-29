"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import {
	ChevronDown,
	ChevronUp,
	LucideIcon,
	MoreHorizontal,
	Plus,
	Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ItemProps {
	id?: Id<"documents">;
	documentIcon?: string;
	active?: boolean;
	expanded?: boolean;
	isSearch?: boolean;
	level?: number;
	onExpand?: () => void;
	label: string;
	icon: LucideIcon;
	onClick: () => void;
}

export const Item = ({
	id,
	documentIcon,
	active,
	isSearch,
	level = 0,
	expanded,
	onExpand,
	label,
	icon: Icon,
	onClick,
}: ItemProps) => {
	const { user } = useUser();
	const create = useMutation(api.documents.create);
	const archive = useMutation(api.documents.archive);
	const router = useRouter();

	const handleExpand = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		event.preventDefault();
		event.stopPropagation();

		onExpand?.();
	};

	const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		event.stopPropagation();

		if (!id) return;

		const createPromise = create({
			title: "Untitled",
			parentDocument: id,
		}).then((documentId) => {
			if (!expanded) {
				onExpand?.();
			}

			// FIXME: uncomment after adding a document page
			// router.push(`/documents/${documentId}`);
		});

		toast.promise(createPromise, {
			loading: "Creating a new node...",
			success: "New node created!",
			error: "Failed to create node.",
		});
	};

	const onArchieve = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		event.stopPropagation();

		if (!id) return;

		const promise = archive({
			id,
		});

		toast.promise(promise, {
			loading: "Moving node to trash...",
			success: "Node moved to trash",
			error: "Failed to archieve node",
		});
	};

	const ChevronIcon = expanded ? ChevronDown : ChevronUp;

	return (
		<div
			role="button"
			style={{
				paddingLeft: level ? `${level * 12 + 12}px` : "12px",
			}}
			className={cn(
				"cursor-pointer group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
				active && "bg-primary/5 text-primary"
			)}
			onClick={onClick}
		>
			{!!id && (
				<div
					role="button"
					className="cursor-pointer h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
					onClick={handleExpand}
				>
					<ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
				</div>
			)}

			{documentIcon ? (
				<div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
			) : (
				<Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
			)}

			<span className="truncate">{label}</span>
			{isSearch && (
				<kbd
					className="ml-auto pointer-events-none inline-flex h-5 select-none 
				items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
				>
					<span className="text-xs">⌘</span>K
				</kbd>
			)}
			{!!id && (
				<div className="ml-auto flex items-center gap-x-2">
					<DropdownMenu>
						<DropdownMenuTrigger
							asChild
							onClick={(e) => e.stopPropagation()}
						>
							<div
								role="buttun"
								className="cursor-pointer p-0.5 opacity-0 group-hover:opacity-100 
								h-full ml-auto rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600"
							>
								<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-60"
							align="start"
							side="right"
							forceMount
						>
							<DropdownMenuItem onClick={onArchieve}>
								<Trash className="h-4 w-4 mr-2" />
								Delete
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<div className="text-xs text-muted-foreground p-2">
								Last Edited By: {user?.fullName}
							</div>
						</DropdownMenuContent>
					</DropdownMenu>
					<div
						role="button"
						className="cursor-pointer opacity-0 group-hover:opacity-100 h-full 
					ml-auto rounded-lg hover:bg-neutral-300 dark:hover-bg-neutral-600 p-0.5"
						onClick={onCreate}
					>
						<Plus className="h-4 w-4 text-muted-foreground" />
					</div>
				</div>
			)}
		</div>
	);
};

export const ItemSkeleton = ({ level = 0 }: { level?: number }) => {
	return (
		<div
			style={{
				paddingLeft: level ? `${level * 12 + 25}px` : "12px",
			}}
			className="flex gap-x-2 py-[3px]"
		>
			<Skeleton className="h-4 w-4" />
			<Skeleton className="h-4 w-[30%]" />
		</div>
	);
};
