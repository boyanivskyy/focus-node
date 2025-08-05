"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useEdgeStore } from "@/lib/edgestore";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "../single-image-dropzone";

export function CoverImageModal() {
	const params = useParams();
	const update = useMutation(api.documents.update);
	const [file, setFile] = useState<File>();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const coverImage = useCoverImage();
	const { edgestore } = useEdgeStore();

	const onClose = () => {
		setFile(undefined);
		setIsSubmitting(false);
		coverImage.onClose();
	};

	const onChange = async (file?: File) => {
		if (file) {
			setIsSubmitting(true);
			setFile(file);

			let res;

			if (coverImage.url) {
				res = await edgestore.publicFiles.upload({
					file,
					options: {
						replaceTargetUrl: coverImage.url,
					},
				});
			} else {
				res = await edgestore.publicFiles.upload({
					file,
					options: {
						replaceTargetUrl: coverImage.url,
					},
				});
			}

			await update({
				id: params.documentId as Id<"documents">,
				coverImage: res.url,
			});

			onClose();
		}
	};

	return (
		<Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						<h2 className="text-center text-lg font-semibold">
							Cover Image
						</h2>
					</DialogTitle>
				</DialogHeader>
				<SingleImageDropzone
					className="w-full outline-none"
					disabled={isSubmitting}
					value={file}
					onChange={onChange}
				/>
			</DialogContent>
		</Dialog>
	);
}
