import {useEffect, useRef, useState} from 'react';

/**
 * MasonryImages Component
 *
 * A masonry layout showcasing various property and hospitality images.
 * Used as the right side visual element on onboarding/auth screens.
 *
 * Features:
 * - Fluid width, full height layout
 * - Overflow hidden to prevent scrolling
 * - Responsive masonry grid
 * - Smooth animations on load
 * - Optimized for different screen sizes
 *
 * @example
 * <MasonryImages />
 */

// Sample images - replace with your actual image URLs
const images = [
    {
        src: 'https://images.pexels.com/photos/28344021/pexels-photo-28344021.jpeg',
        alt: 'Modern hotel exterior',
    },
    {
        src: 'https://images.pexels.com/photos/19737859/pexels-photo-19737859.jpeg',
        alt: 'Hotel lobby',
    },
    {
        src: 'https://images.pexels.com/photos/15923475/pexels-photo-15923475.jpeg',
        alt: 'Luxury hotel room',
    },
    {
        src: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=400&fit=crop',
        alt: 'Cozy bedroom',
    },
    {
        src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=550&fit=crop',
        alt: 'Hotel reception',
    },
    {
        src: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=350&fit=crop',
        alt: 'Swimming pool',
    },
    {
        src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=450&fit=crop',
        alt: 'Beach resort',
    },
    {
        src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=500&fit=crop',
        alt: 'Hotel suite',
    },
    {
        src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=400&fit=crop',
        alt: 'Modern apartment',
    },
    {
        src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=600&fit=crop',
        alt: 'City hotel view',
    },
    {
        src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=350&fit=crop',
        alt: 'Boutique hotel',
    },
    {
        src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=500&fit=crop',
        alt: 'Vacation rental',
    },
];

export function MasonryImages() {
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Preload images
        images.forEach((image, index) => {
            const img = new Image();
            img.src = image.src;
            img.onload = () => {
                setLoadedImages((prev) => new Set(prev).add(index));
            };
        });
    }, []);

    return (
        <div
            ref={containerRef}
            className="h-full w-full overflow-hidden relative bg-accent px-3 hidden lg:block"
        >
            {/* Masonry Grid Container */}
            <div className="columns-2 gap-3">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`
              mb-3 break-inside-avoid overflow-hidden
              transition-all duration-500 ease-out
              ${loadedImages.has(index) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        }
            `}
                    >
                        <img
                            src={image.src}
                            alt={image.alt}
                            loading="lazy"
                            className="w-full h-auto object-cover hover:shadow-xl transition-shadow duration-300"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MasonryImages;