import 'package:cloud_firestore/cloud_firestore.dart';

class CowRecord {
  final String id;
  final String farmId;
  final String tagId;
  final String name;
  final String breed;
  final DateTime? dob;
  final String gender;
  final String status; // active, dry, pregnant, sick, sold, deceased, archived
  final DateTime? purchaseDate;
  final double purchaseCost;
  final String? photoUrl;
  final String notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  CowRecord({
    required this.id,
    required this.farmId,
    required this.tagId,
    required this.name,
    required this.breed,
    this.dob,
    required this.gender,
    required this.status,
    this.purchaseDate,
    required this.purchaseCost,
    this.photoUrl,
    required this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  factory CowRecord.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return CowRecord(
      id: doc.id,
      farmId: data['farmId'] ?? '',
      tagId: data['tagId'] ?? '',
      name: data['name'] ?? '',
      breed: data['breed'] ?? '',
      dob: data['dob'] != null ? (data['dob'] as Timestamp).toDate() : null,
      gender: data['gender'] ?? 'Female',
      status: data['status'] ?? 'active',
      purchaseDate: data['purchaseDate'] != null ? (data['purchaseDate'] as Timestamp).toDate() : null,
      purchaseCost: (data['purchaseCost'] ?? 0).toDouble(),
      photoUrl: data['photoUrl'],
      notes: data['notes'] ?? '',
      createdAt: data['createdAt'] != null ? (data['createdAt'] as Timestamp).toDate() : DateTime.now(),
      updatedAt: data['updatedAt'] != null ? (data['updatedAt'] as Timestamp).toDate() : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'farmId': farmId,
      'tagId': tagId,
      'name': name,
      'breed': breed,
      'dob': dob != null ? Timestamp.fromDate(dob!) : null,
      'gender': gender,
      'status': status,
      'purchaseDate': purchaseDate != null ? Timestamp.fromDate(purchaseDate!) : null,
      'purchaseCost': purchaseCost,
      'photoUrl': photoUrl,
      'notes': notes,
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': Timestamp.fromDate(updatedAt),
    };
  }
}
