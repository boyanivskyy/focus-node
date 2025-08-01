"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";

interface TitleProps {
	initialData: Doc<"documents">;
}

export const Title = ({ initialData }: TitleProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const update = useMutation(api.documents.update);

	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [title, setTitle] = useState<string>(initialData.title || "");

	const enableInput = () => {
		setTitle(initialData.title);
		setIsEditing(true);
		setTimeout(() => {
			inputRef?.current?.focus();
			inputRef?.current?.setSelectionRange(
				0,
				inputRef.current.value.length
			);
		}, 0);
	};

	const disableInput = () => {
		setIsEditing(false);
	};

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value);
		update({
			id: initialData._id,
			title: event.target.value || "Untitled",
		});
	};

	const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "enter") {
			disableInput();
		}
	};

	return (
		<div className="flex items-center gap-x-1">
			{!!initialData.icon && <p>{initialData.icon}</p>}
			{isEditing ? (
				<Input
					ref={inputRef}
					className="h-7 px-2 focus-visible:ring-transparent"
					value={title}
					onBlur={disableInput}
					onChange={onChange}
					onKeyDown={onKeyDown}
				/>
			) : (
				<Button
					variant="ghost"
					size="sm"
					className="font-normal h-auto p-1"
					onClick={enableInput}
				>
					<span className="truncate">{initialData.title}</span>
				</Button>
			)}
		</div>
	);
};

export const TitleSkeleton = () => {
	return <Skeleton className="h-6 w-20 rounded-md" />;
};
