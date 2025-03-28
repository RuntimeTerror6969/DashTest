import ProductCard from './ProductCard';

export default function ProductsSection() {
  const products = [
    {
      id: 1,
      title: 'QuantCopier',
      description: 'Automated trade execution and position management for trade ideas sent in Discord or Telegram.',
      images: {
        primary: '/product-1a.jpg',
        secondary: '/product-1b.jpg'
      },
      slug: 'quantcopier'
    },
    {
      id: 2,
      title: 'MessageCopier',
      description: 'Clone and broadcast messages from one channel to another in Discord and Telegram',
      images: {
        primary: '/product-2a.jpg',
        secondary: '/product-2b.jpg'
      },
      slug: 'messagecopier'
    }
  ];

  return (
    <section id="products" className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Our Products</h2>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 