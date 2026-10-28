class Product {
  final String id;
  final String sku;
  final String name;
  final String nameHi;
  final String nameKn;
  final String category;
  final String unit;
  final double price;
  final double? originalPrice;
  final String fat;
  final String snf;
  final String imageUrl;
  final String description;
  final String badge;
  final bool subscriptionAvailable;

  Product({
    required this.id,
    required this.sku,
    required this.name,
    required this.nameHi,
    required this.nameKn,
    required this.category,
    required this.unit,
    required this.price,
    this.originalPrice,
    required this.fat,
    required this.snf,
    required this.imageUrl,
    required this.description,
    required this.badge,
    required this.subscriptionAvailable,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? '',
      sku: json['sku'] ?? '',
      name: json['name'] ?? '',
      nameHi: json['name_hi'] ?? '',
      nameKn: json['name_kn'] ?? '',
      category: json['category'] ?? '',
      unit: json['unit'] ?? 'litre',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      originalPrice: (json['originalPrice'] as num?)?.toDouble(),
      fat: json['fat'] ?? '4.5%',
      snf: json['snf'] ?? '8.8%',
      imageUrl: json['imageUrl'] ?? '',
      description: json['description'] ?? '',
      badge: json['badge'] ?? 'Farm Fresh',
      subscriptionAvailable: json['subscriptionAvailable'] ?? true,
    );
  }
}
