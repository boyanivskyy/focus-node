"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { ChevronsLeftRight } from "lucide-react";

export const UserItem = () => {
	const { user } = useUser();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div
					role="button"
					className="cursor-pointer flex items-center text-sm p-3 w-full hover:bg-primary/5"
				>
					<div className="gap-x-2 flex items-center max-w-[170px]">
						<Avatar className="h-5 w-5 ">
							<AvatarImage src={user?.imageUrl} />
						</Avatar>
						<span className="text-start font-medium line-clamp-1">
							{user?.fullName}&apos;s FocusNode
						</span>
					</div>
					<ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-4 w-4" />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-80"
				align="start"
				alignOffset={11}
				forceMount
			>
				<div className="flex flex-col space-y-4 p-2">
					<p className="text-xs font-medium leading-none text-muted-foreground">
						{user?.emailAddresses[0].emailAddress}
					</p>

					<div className="flex items-center gap-x-2">
						<div className="rounded-md bg-secondary p-1">
							<Avatar className="h-8 w-8">
								<AvatarImage src={user?.imageUrl} />
							</Avatar>
						</div>

						<div className="space-y-1">
							<p className="text-sm line-clamp-1">
								{user?.fullName}&apos;s FocusNode
							</p>
						</div>
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					asChild
					className="w-full cursor-pointer text-muted-foreground"
				>
					<SignOutButton>Log Out</SignOutButton>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
