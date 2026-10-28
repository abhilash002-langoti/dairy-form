import 'package:cloud_firestore/cloud_firestore.dart';

/// FlutterFlow Custom Action: Check if duplicate milk entry exists
/// Returns true if duplicate exists, false otherwise.
Future<bool> checkDuplicateMilk(
  String farmId,
  String cowId,
  String date,
  String session,
  String? currentRecordId,
) async {
  try {
    Query query = FirebaseFirestore.instance
        .collection('milk_records')
        .where('farmId', isEqualTo: farmId)
        .where('cowId', isEqualTo: cowId)
        .where('date', isEqualTo: date)
        .where('session', isEqualTo: session);

    QuerySnapshot snapshot = await query.get();

    if (snapshot.docs.isEmpty) {
      return false;
    }

    // If editing existing record, ignore itself
    if (currentRecordId != null && currentRecordId.isNotEmpty) {
      for (var doc in snapshot.docs) {
        if (doc.id != currentRecordId) {
          return true; // Another record exists
        }
      }
      return false;
    }

    return true; // Duplicate found
  } catch (e) {
    print('Error checking duplicate milk record: $e');
    return false;
  }
}
