import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/product.dart';
import '../models/subscription.dart';

class ApiService {
  // Configurable base URL: 10.0.2.2 for Android emulator, localhost for iOS simulator/web
  static const String baseUrl = 'http://10.0.2.2:3000/api';

  static Future<List<Product>> fetchProducts({String? category}) async {
    final uri = Uri.parse('$baseUrl/products${category != null ? '?category=$category' : ''}');
    final res = await http.get(uri);
    if (res.statusCode == 200) {
      final data = json.decode(res.body);
      final List list = data['products'] ?? [];
      return list.map((json) => Product.fromJson(json)).toList();
    }
    throw Exception('Failed to load products');
  }

  static Future<Map<String, dynamic>> checkPincode(String pincode) async {
    final uri = Uri.parse('$baseUrl/pincodes/check?pincode=$pincode');
    final res = await http.get(uri);
    return json.decode(res.body);
  }

  static Future<Map<String, dynamic>> sendOtp(String phone) async {
    final uri = Uri.parse('$baseUrl/auth/send-otp');
    final res = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'phone': phone}),
    );
    return json.decode(res.body);
  }

  static Future<Map<String, dynamic>> verifyOtp(String phone, String otp) async {
    final uri = Uri.parse('$baseUrl/auth/verify-otp');
    final res = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'phone': phone, 'otp': otp}),
    );
    return json.decode(res.body);
  }

  static Future<List<SubscriptionItem>> fetchSubscriptions(String customerId) async {
    final uri = Uri.parse('$baseUrl/subscriptions?customerId=$customerId');
    final res = await http.get(uri);
    if (res.statusCode == 200) {
      final data = json.decode(res.body);
      final List list = data['subscriptions'] ?? [];
      return list.map((j) => SubscriptionItem.fromJson(j)).toList();
    }
    return [];
  }

  static Future<bool> toggleSkipDate(String subscriptionId, String date) async {
    final uri = Uri.parse('$baseUrl/subscriptions/$subscriptionId/skip-date');
    final res = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'date': date}),
    );
    return res.statusCode == 200;
  }

  static Future<Map<String, dynamic>> rechargeWallet(String customerId, double amount) async {
    final uri = Uri.parse('$baseUrl/customer/wallet/recharge');
    final res = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'customerId': customerId, 'amount': amount}),
    );
    return json.decode(res.body);
  }
}
