"use client";

import { api } from "@/convex/_generated/api";
import { useSearch } from "@/hooks/use-search";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "./ui/command";
import { File } from "lucide-react";

export const SearchCommand = () => {
	const { user } = useUser();
	const router = useRouter();
	const documents = useQuery(api.documents.getSearch);
	const [isMounted, setIsMounted] = useState(false);

	const toggle = useSearch((store) => store.toggle);
	const isOpen = useSearch((store) => store.isOpen);
	const onClose = useSearch((store) => store.onClose);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		const down = (event: KeyboardEvent) => {
			if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				toggle();
			}
		};

		document.addEventListener("keydown", down);

		return () => document.removeEventListener("keydown", down);
	}, [toggle]);

	const onSelect = (id: string) => {
		router.push(`/documents/${id}`);
		onClose();
	};

	if (!isMounted) {
		return null;
	}

	return (
		<CommandDialog open={isOpen} onOpenChange={onClose}>
			<CommandInput placeholder={`Search ${user?.fullName}'s nodes...`} />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Documents">
					{documents?.map((document) => (
						<CommandItem
							key={document._id}
							value={`${document._id}-${document.title}`}
							title={document.title}
							onSelect={onSelect}
						>
							{document.icon ? (
								<p className="mr-2 text-[18px]">
									{document.icon}
								</p>
							) : (
								<File />
							)}
							<span>{document.title}</span>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
};
