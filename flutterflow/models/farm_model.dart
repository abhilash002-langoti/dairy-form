import 'package:cloud_firestore/cloud_firestore.dart';

class FarmRecord {
  final String id;
  final String name;
  final String ownerUid;
  final String phone;
  final String village;
  final String district;
  final String state;
  final DateTime createdAt;

  FarmRecord({
    required this.id,
    required this.name,
    required this.ownerUid,
    required this.phone,
    required this.village,
    required this.district,
    required this.state,
    required this.createdAt,
  });

  factory FarmRecord.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return FarmRecord(
      id: doc.id,
      name: data['name'] ?? '',
      ownerUid: data['ownerUid'] ?? '',
      phone: data['phone'] ?? '',
      village: data['village'] ?? '',
      district: data['district'] ?? '',
      state: data['state'] ?? 'Karnataka',
      createdAt: data['createdAt'] != null ? (data['createdAt'] as Timestamp).toDate() : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'ownerUid': ownerUid,
      'phone': phone,
      'village': village,
      'district': district,
      'state': state,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
}
