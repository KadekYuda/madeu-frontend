import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kelas Musik Saya',
};

export default function MusicClassPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Kelas Musik</h1>
      <p>Halaman ini sedang dalam pengembangan.</p>
    </div>
  );
}