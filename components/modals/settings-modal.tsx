"use client";

import { useSettings } from "@/hooks/use-settings";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { ThemeModeToggle } from "../theme-mode-toggle";

export const SettingsModal = () => {
	const settings = useSettings();

	return (
		<Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
			<DialogContent aria-describedby={"Settings Dialog content"}>
				<DialogTitle>
					<DialogHeader className="border-b pb-3">
						<h2 className="text-lg font-medium">My Settings</h2>
					</DialogHeader>
				</DialogTitle>
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-y-1">
						<Label>Appearance</Label>
						<span className="text-[0.8rem] text-muted-foreground">
							Customize how FocusNode looks on your device
						</span>
					</div>
					<ThemeModeToggle />
				</div>
			</DialogContent>
		</Dialog>
	);
};
