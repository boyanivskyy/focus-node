"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Item, ItemSkeleton } from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface DocumentListProps {
	parentDocumentId?: Id<"documents">;
	level?: number;
	data?: Doc<"documents">[];
}

export const DocumentList = ({
	parentDocumentId,
	level = 0,
	data,
}: DocumentListProps) => {
	const params = useParams();
	const router = useRouter();
	const [expanded, setExpanded] = useState<Record<string, boolean>>({});

	const onExpand = (documentId: string) => {
		setExpanded((prevExpanded) => ({
			...prevExpanded,
			[documentId]: !prevExpanded[documentId],
		}));
	};

	const documents = useQuery(api.documents.getSidebar, {
		parentDocument: parentDocumentId,
	});

	const onRedirect = (documentId: string) => {
		router.push(`/documents/${documentId}`);
	};

	// undefined means it is loading, when it is loaded it will be null
	if (documents === undefined) {
		return (
			<>
				<ItemSkeleton level={level} />
				{level === 0 && (
					<>
						<ItemSkeleton level={level} />
						<ItemSkeleton level={level} />
					</>
				)}
			</>
		);
	}

	return (
		<>
			<p
				style={{
					paddingLeft: level ? `${level * 12 + 25}px` : undefined,
				}}
				className={cn(
					"hidden text-sm font-medium text-muted-foreground/80",
					expanded && "last:block",
					level === 0 && "hidden"
				)}
			>
				No Pages inside
			</p>
			{documents.map((document) => (
				<div key={document._id}>
					<Item
						id={document._id}
						onClick={() => onRedirect(document._id)}
						label={document.title}
						icon={FileIcon}
						documentIcon={document.icon}
						active={params.documentId === document._id}
						level={level}
						onExpand={() => onExpand(document._id)}
						expanded={expanded[document._id]}
					/>
					{expanded[document._id] && (
						<DocumentList
							parentDocumentId={document._id}
							level={level + 1}
						/>
					)}
				</div>
			))}
		</>
	);
};
