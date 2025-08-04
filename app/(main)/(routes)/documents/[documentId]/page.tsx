"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import React from "react";
import { Toolbar } from "@/components/toolbar";

interface DocumentIdPageProps {
	params: Promise<{
		documentId: Id<"documents">;
	}>;
}

export default function DocumentIdPage({ params }: DocumentIdPageProps) {
	const { documentId } = React.use<{ documentId: Id<"documents"> }>(params);

	const document = useQuery(api.documents.getById, {
		documentId,
	});

	if (document === undefined) {
		return <div>Loading...</div>;
	}

	if (document === null) {
		return <div>Not Found.</div>;
	}

	return (
		<div className="pb-40">
			<div className="h-[35vh]"></div>
			<div className="md:max-w-3xl lg:max-w-4xl mx-auto">
				<Toolbar initialData={document} />
			</div>
		</div>
	);
}
