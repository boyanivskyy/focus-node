"use client";

import { cn } from "@/lib/utils";
import {
	ChevronsLeft,
	MenuIcon,
	Plus,
	PlusCircle,
	Search,
	Settings,
	Trash,
} from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { ComponentRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { UserItem } from "./user-item";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Item } from "./item";
import { toast } from "sonner";
import { DocumentList } from "./document-list";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { TrashBox } from "./trash-box";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { Navbar } from "./navbar";

export const Navigation = () => {
	const pathname = usePathname();
	const params = useParams();

	const isMobile = useMediaQuery("(max-width: 768px)");
	const create = useMutation(api.documents.create);
	const onOpenSearch = useSearch((state) => state.onOpen);
	const onOpenSettings = useSettings((state) => state.onOpen);

	const isResizingRef = useRef(false);
	const sidebarRef = useRef<ComponentRef<"aside">>(null);
	const navbarRef = useRef<ComponentRef<"div">>(null);
	const [isResetting, setIsResetting] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(true);

	useEffect(() => {
		if (isMobile) {
			collapse();
		} else {
			resetWidth();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMobile]);

	useEffect(() => {
		if (isMobile) {
			collapse();
		}
	}, [pathname, isMobile]);

	const handleMouseDown = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		e.preventDefault();
		e.stopPropagation();

		isResizingRef.current = true;
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!isResizingRef.current) return;

		let newWidth = e.clientX;
		if (newWidth < 240) newWidth = 240;

		if (newWidth > 480) newWidth = 480;

		if (sidebarRef.current && navbarRef.current) {
			sidebarRef.current.style.width = `${newWidth}px`;
			navbarRef.current.style.setProperty("left", `${newWidth}px`);
			navbarRef.current.style.setProperty(
				"width",
				`calc(100% - ${newWidth}px)`
			);
		}
	};

	const handleMouseUp = () => {
		isResizingRef.current = false;

		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
	};

	const resetWidth = () => {
		if (sidebarRef.current && navbarRef.current) {
			setIsCollapsed(false);
			setIsResetting(true);

			sidebarRef.current.style.width = isMobile ? "100%" : "240px";
			navbarRef.current.style.setProperty(
				"width",
				isMobile ? "0" : "calc(100% - 240px)"
			);

			navbarRef.current.style.setProperty(
				"left",
				isMobile ? "100%" : "240px"
			);

			setTimeout(() => {
				setIsResetting(false);
			}, 300);
		}
	};

	const collapse = () => {
		if (sidebarRef.current && navbarRef.current) {
			setIsCollapsed(true);
			setIsResetting(true);

			sidebarRef.current.style.width = "0";
			navbarRef.current.style.setProperty("width", "100%");
			navbarRef.current.style.setProperty("left", "0");

			setTimeout(() => {
				setIsResetting(false);
			}, 300);
		}
	};

	const handleCreate = () => {
		const createPromise = create({
			title: "Untitled",
		});

		toast.promise(createPromise, {
			loading: "Creating a new node...",
			success: "New node created!",
			error: "Failed to create node.",
		});
	};

	return (
		<>
			<aside
				ref={sidebarRef}
				className={cn(
					"group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
					isResetting && "transition-all ease-in-out duration-300",
					isMobile && "w-0"
				)}
			>
				<div
					role="button"
					className={cn(
						"h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
						isMobile && "opacity-100"
					)}
					onClick={collapse}
				>
					<ChevronsLeft className="h-6 w-6" />
				</div>
				<div>
					<UserItem />
					<Item
						label="Search"
						icon={Search}
						isSearch
						onClick={onOpenSearch}
					/>
					<Item
						label="Settings"
						icon={Settings}
						onClick={onOpenSettings}
					/>
					<Item
						onClick={handleCreate}
						label="New page"
						icon={PlusCircle}
					/>
				</div>
				<div className="mt-4">
					<DocumentList />
					<Item
						onClick={handleCreate}
						icon={Plus}
						label="Add a page"
					/>
					<Popover>
						<PopoverTrigger className="w-full mt-4 ">
							<Item label="Trash" icon={Trash} />
						</PopoverTrigger>
						<PopoverContent
							className="p-0 w-72"
							side={isMobile ? "bottom" : "right"}
						>
							<TrashBox />
						</PopoverContent>
					</Popover>
				</div>
				<div
					onMouseDown={handleMouseDown}
					onClick={resetWidth}
					className="opacity-0 group-hover/sidebar:opacity-100 transition 
                cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
				/>
			</aside>
			<div
				ref={navbarRef}
				className={cn(
					"absolute top-0 z-[99999] left-60 w-[calc(100% - 240px)]",
					isResetting && "transition-all ease-in-out duration-300",
					isMobile && "left-0 w-full"
				)}
			>
				{!!params.documentId ? (
					<Navbar
						isCollapsed={isCollapsed}
						onResetWidth={resetWidth}
					/>
				) : (
					<nav className="bg-transparent px-3 py-2 w-full">
						{isCollapsed && (
							<MenuIcon
								role="button"
								className="h-6 w-6 text-muted-foreground"
								onClick={resetWidth}
							/>
						)}
					</nav>
				)}
			</div>
		</>
	);
};
