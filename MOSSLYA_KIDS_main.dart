import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MosslyaKidsApp());
}

class Product {
  final String name;
  final String image;
  final String category;
  final int price;

  const Product(
    this.name,
    this.price,
    this.image,
    this.category,
  );
}

const List<Product> products = [
  Product(
    'Butterfly T-Shirt & Shorts Set',
    549,
    'assets/products/product1.png',
    'Sets',
  ),
  Product(
    'Giraffe & Elephant Baby Romper',
    599,
    'assets/products/product2.png',
    'Rompers',
  ),
  Product(
    'Floral Baby Romper',
    599,
    'assets/products/product3.png',
    'Rompers',
  ),
  Product(
    'Giraffe & Elephant Night Set',
    699,
    'assets/products/product4.png',
    'Sets',
  ),
  Product(
    'Elephant & Stars Baby Waistcoat',
    449,
    'assets/products/product5.png',
    'Babywear',
  ),
  Product(
    'Butterfly Print Girls Dress',
    649,
    'assets/products/product6.png',
    'Dresses',
  ),
  Product(
    'Elephant & Garden Girls Dress',
    649,
    'assets/products/product7.png',
    'Dresses',
  ),
];

class MosslyaKidsApp extends StatefulWidget {
  const MosslyaKidsApp({super.key});

  @override
  State<MosslyaKidsApp> createState() => _MosslyaKidsAppState();
}

class _MosslyaKidsAppState extends State<MosslyaKidsApp> {
  int tab = 0;
  final List<Product> cart = [];

  void addToCart(Product product) {
    setState(() {
      cart.add(product);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${product.name} added to cart'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'MOSSLYA KIDS',
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFFFF8F2),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFB98F84),
        ),
        fontFamily: 'Georgia',
      ),
      home: Scaffold(
        body: IndexedStack(
          index: tab,
          children: [
            Home(onAdd: addToCart),
            Shop(onAdd: addToCart),
            Cart(cart: cart),
          ],
        ),
        bottomNavigationBar: NavigationBar(
          selectedIndex: tab,
          onDestinationSelected: (index) {
            setState(() {
              tab = index;
            });
          },
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.home_outlined),
              selectedIcon: Icon(Icons.home),
              label: 'Home',
            ),
            NavigationDestination(
              icon: Icon(Icons.storefront_outlined),
              selectedIcon: Icon(Icons.storefront),
              label: 'Shop',
            ),
            NavigationDestination(
              icon: Icon(Icons.shopping_bag_outlined),
              selectedIcon: Icon(Icons.shopping_bag),
              label: 'Cart',
            ),
          ],
        ),
      ),
    );
  }
}

class Header extends StatelessWidget {
  const Header({super.key});

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.fromLTRB(20, 18, 20, 8),
      child: Column(
        children: [
          Text(
            'MOSSLYA',
            style: TextStyle(
              fontSize: 31,
              letterSpacing: 7,
            ),
          ),
          Text(
            'K I D S',
            style: TextStyle(
              fontSize: 13,
              letterSpacing: 6,
              color: Color(0xFFB98579),
            ),
          ),
          SizedBox(height: 5),
          Text(
            'CLOTHING FOR LITTLE MOMENTS',
            style: TextStyle(
              fontSize: 9,
              letterSpacing: 2.2,
            ),
          ),
        ],
      ),
    );
  }
}

class Home extends StatelessWidget {
  final void Function(Product) onAdd;

  const Home({
    super.key,
    required this.onAdd,
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: CustomScrollView(
        slivers: [
          const SliverToBoxAdapter(
            child: Header(),
          ),
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Text(
                'Little styles,\nbig little moments.',
                style: TextStyle(fontSize: 28),
              ),
            ),
          ),
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.fromLTRB(20, 8, 20, 12),
              child: Text(
                'New Arrivals',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: ProductGrid(
              products: products,
              onAdd: onAdd,
            ),
          ),
        ],
      ),
    );
  }
}

class Shop extends StatelessWidget {
  final void Function(Product) onAdd;

  const Shop({
    super.key,
    required this.onAdd,
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: CustomScrollView(
        slivers: [
          const SliverToBoxAdapter(
            child: Header(),
          ),
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.all(20),
              child: Text(
                'Shop',
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: ProductGrid(
              products: products,
              onAdd: onAdd,
            ),
          ),
        ],
      ),
    );
  }
}

class ProductGrid extends StatelessWidget {
  final List<Product> products;
  final void Function(Product) onAdd;

  const ProductGrid({
    super.key,
    required this.products,
    required this.onAdd,
  });

  @override
  Widget build(BuildContext context) {
    return SliverGrid(
      delegate: SliverChildBuilderDelegate(
        (context, index) {
          final product = products[index];

          return Card(
            color: Colors.white,
            elevation: 0,
            clipBehavior: Clip.antiAlias,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(18),
            ),
            child: InkWell(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => ProductDetails(
                      product: product,
                      onAdd: onAdd,
                    ),
                  ),
                );
              },
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Image.asset(
                      product.image,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(10, 8, 10, 2),
                    child: Text(
                      product.name,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  Row(
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(left: 10),
                        child: Text(
                          '₹${product.price}',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const Spacer(),
                      IconButton(
                        onPressed: () => onAdd(product),
                        icon: const Icon(
                          Icons.add_shopping_cart,
                          size: 20,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
        childCount: products.length,
      ),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 14,
        childAspectRatio: 0.68,
      ),
    );
  }
}

class ProductDetails extends StatefulWidget {
  final Product product;
  final void Function(Product) onAdd;

  const ProductDetails({
    super.key,
    required this.product,
    required this.onAdd,
  });

  @override
  State<ProductDetails> createState() => _ProductDetailsState();
}

class _ProductDetailsState extends State<ProductDetails> {
  String size = '1–2Y';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Product'),
      ),
      body: ListView(
        children: [
          Image.asset(
            widget.product.image,
            height: 430,
            fit: BoxFit.cover,
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.product.name,
                  style: const TextStyle(
                    fontSize: 25,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '₹${widget.product.price}',
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 15),
                const Text(
                  '100% Muslin',
                  style: TextStyle(fontSize: 16),
                ),
                const Text(
                  'Age: 0–3 years',
                  style: TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 18),
                const Text(
                  'Select Size',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 7,
                  children: [
                    '0–3M',
                    '3–6M',
                    '6–12M',
                    '1–2Y',
                    '2–3Y',
                  ].map(
                    (itemSize) {
                      return ChoiceChip(
                        label: Text(itemSize),
                        selected: size == itemSize,
                        onSelected: (_) {
                          setState(() {
                            size = itemSize;
                          });
                        },
                      );
                    },
                  ).toList(),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: () => widget.onAdd(widget.product),
                    child: const Text('ADD TO CART'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class Cart extends StatelessWidget {
  final List<Product> cart;

  const Cart({
    super.key,
    required this.cart,
  });

  @override
  Widget build(BuildContext context) {
    final total = cart.fold<int>(
      0,
      (sum, product) => sum + product.price,
    );

    return SafeArea(
      child: Column(
        children: [
          const Header(),
          Expanded(
            child: cart.isEmpty
                ? const Center(
                    child: Text('Your cart is empty'),
                  )
                : ListView.builder(
                    itemCount: cart.length,
                    itemBuilder: (context, index) {
                      final product = cart[index];

                      return ListTile(
                        leading: Image.asset(
                          product.image,
                          width: 55,
                          fit: BoxFit.cover,
                        ),
                        title: Text(product.name),
                        trailing: Text(
                          '₹${product.price}',
                        ),
                      );
                    },
                  ),
          ),
          if (cart.isNotEmpty)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Total',
                        style: TextStyle(fontSize: 18),
                      ),
                      Text(
                        '₹$total',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => Checkout(
                              amount: total,
                            ),
                          ),
                        );
                      },
                      child: const Text(
                        'PROCEED TO CHECKOUT',
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

class Checkout extends StatefulWidget {
  final int amount;

  const Checkout({
    super.key,
    required this.amount,
  });

  @override
  State<Checkout> createState() => _CheckoutState();
}

class _CheckoutState extends State<Checkout> {
  late final TextEditingController apiController;

  bool busy = false;
  String message = '';

  @override
  void initState() {
    super.initState();

    // Set the text separately to avoid any TextEditingController
    // constructor compatibility/syntax issue.
    apiController = TextEditingController();
    apiController.text = 'https://YOUR-API-DOMAIN.com';
  }

  @override
  void dispose() {
    apiController.dispose();
    super.dispose();
  }

  Future<void> createOrder() async {
    final apiBase = apiController.text.trim();

    if (apiBase.isEmpty ||
        apiBase == 'https://YOUR-API-DOMAIN.com') {
      setState(() {
        message = 'Please enter your backend API URL first.';
      });
      return;
    }

    setState(() {
      busy = true;
      message = '';
    });

    try {
      final url = Uri.parse(
        '$apiBase/api/payments/create-order',
      );

      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'amount': widget.amount * 100,
          'currency': 'INR',
          'receipt': 'mosslya_demo',
        }),
      );

      if (!mounted) {
        return;
      }

      if (response.statusCode >= 200 &&
          response.statusCode < 300) {
        setState(() {
          message =
              'Razorpay order created. Next connect the Razorpay checkout SDK using the returned order_id.';
        });
      } else {
        setState(() {
          message =
              'Backend returned ${response.statusCode}. Check your API and Razorpay test configuration.';
        });
      }
    } catch (_) {
      if (!mounted) {
        return;
      }

      setState(() {
        message =
            'Could not reach the backend. Check your API URL.';
      });
    } finally {
      if (mounted) {
        setState(() {
          busy = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Checkout'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Order total: ₹${widget.amount}',
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 18),
            const Text('Backend API URL'),
            TextField(
              controller: apiController,
              keyboardType: TextInputType.url,
              decoration: const InputDecoration(
                hintText: 'https://api.example.com',
              ),
            ),
            const SizedBox(height: 18),
            const Text(
              'Razorpay is intentionally kept server-side. '
              'Never place the Razorpay Key Secret in this app.',
            ),
            const SizedBox(height: 18),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: busy ? null : createOrder,
                child: Text(
                  busy
                      ? 'Creating order...'
                      : 'CREATE TEST RAZORPAY ORDER',
                ),
              ),
            ),
            const SizedBox(height: 18),
            Text(message),
          ],
        ),
      ),
    );
  }
}
