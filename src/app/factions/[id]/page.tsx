import React from 'react';
import { notFound } from 'next/navigation';
import { getFactionById } from '@/data/factions';
import { Metadata } from 'next';
import ClientMagazineLayout from './ClientMagazineLayout';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const faction = getFactionById(id);
    if (!faction) return { title: 'Not Found' };
    return {
        title: `${faction.name} - 무협`,
        description: faction.desc,
    };
}

export default async function FactionPage({ params }: Props) {
    const { id } = await params;
    const faction = getFactionById(id);

    if (!faction) notFound();

    return <ClientMagazineLayout faction={faction} />;
}
