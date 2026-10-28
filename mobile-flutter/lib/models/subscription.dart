class SubscriptionItem {
  final String id;
  final String customerId;
  final String productId;
  final String productName;
  final String frequency;
  final double quantity;
  final double unitPrice;
  final String timeSlot;
  final String startDate;
  final String status;
  final String deliveryAddress;
  final String pincode;
  final List<String> skippedDates;

  SubscriptionItem({
    required this.id,
    required this.customerId,
    required this.productId,
    required this.productName,
    required this.frequency,
    required this.quantity,
    required this.unitPrice,
    required this.timeSlot,
    required this.startDate,
    required this.status,
    required this.deliveryAddress,
    required this.pincode,
    required this.skippedDates,
  });

  factory SubscriptionItem.fromJson(Map<String, dynamic> json) {
    return SubscriptionItem(
      id: json['id'] ?? '',
      customerId: json['customerId'] ?? '',
      productId: json['productId'] ?? '',
      productName: json['productName'] ?? '',
      frequency: json['frequency'] ?? 'daily',
      quantity: (json['quantity'] as num?)?.toDouble() ?? 1.0,
      unitPrice: (json['unitPrice'] as num?)?.toDouble() ?? 0.0,
      timeSlot: json['timeSlot'] ?? 'morning',
      startDate: json['startDate'] ?? '',
      status: json['status'] ?? 'active',
      deliveryAddress: json['deliveryAddress'] ?? '',
      pincode: json['pincode'] ?? '',
      skippedDates: List<String>.from(json['skippedDates'] ?? []),
    );
  }
}
