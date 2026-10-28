import 'package:cloud_firestore/cloud_firestore.dart';

/// FlutterFlow Custom Action: Calculate daily milk totals for farm
/// Returns a map with { 'totalLitres': double, 'morningLitres': double, 'eveningLitres': double, 'activeCowsMilked': int }
Future<Map<String, dynamic>> calculateMilkTotals(
  String farmId,
  String date,
) async {
  try {
    QuerySnapshot snapshot = await FirebaseFirestore.instance
        .collection('milk_records')
        .where('farmId', isEqualTo: farmId)
        .where('date', isEqualTo: date)
        .get();

    double morningLitres = 0.0;
    double eveningLitres = 0.0;
    Set<String> uniqueCows = {};

    for (var doc in snapshot.docs) {
      Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
      double qty = (data['quantityLitres'] ?? 0.0).toDouble();
      String session = data['session'] ?? 'morning';
      String cowId = data['cowId'] ?? '';

      if (session == 'morning') {
        morningLitres += qty;
      } else if (session == 'evening') {
        eveningLitres += qty;
      }

      if (cowId.isNotEmpty) {
        uniqueCows.add(cowId);
      }
    }

    return {
      'totalLitres': morningLitres + eveningLitres,
      'morningLitres': morningLitres,
      'eveningLitres': eveningLitres,
      'activeCowsMilked': uniqueCows.length,
    };
  } catch (e) {
    print('Error calculating milk totals: $e');
    return {
      'totalLitres': 0.0,
      'morningLitres': 0.0,
      'eveningLitres': 0.0,
      'activeCowsMilked': 0,
    };
  }
}
