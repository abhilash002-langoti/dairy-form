import 'package:cloud_firestore/cloud_firestore.dart';

class MilkRecord {
  final String id;
  final String farmId;
  final String cowId;
  final String cowTag;
  final String date; // YYYY-MM-DD
  final String session; // 'morning' or 'evening'
  final double quantityLitres;
  final double? fatContent;
  final double? snf;
  final String notes;
  final String recordedBy;
  final DateTime createdAt;
  final DateTime updatedAt;

  MilkRecord({
    required this.id,
    required this.farmId,
    required this.cowId,
    required this.cowTag,
    required this.date,
    required this.session,
    required this.quantityLitres,
    this.fatContent,
    this.snf,
    required this.notes,
    required this.recordedBy,
    required this.createdAt,
    required this.updatedAt,
  });

  factory MilkRecord.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return MilkRecord(
      id: doc.id,
      farmId: data['farmId'] ?? '',
      cowId: data['cowId'] ?? '',
      cowTag: data['cowTag'] ?? '',
      date: data['date'] ?? '',
      session: data['session'] ?? 'morning',
      quantityLitres: (data['quantityLitres'] ?? 0).toDouble(),
      fatContent: data['fatContent'] != null ? (data['fatContent'] as num).toDouble() : null,
      snf: data['snf'] != null ? (data['snf'] as num).toDouble() : null,
      notes: data['notes'] ?? '',
      recordedBy: data['recordedBy'] ?? '',
      createdAt: data['createdAt'] != null ? (data['createdAt'] as Timestamp).toDate() : DateTime.now(),
      updatedAt: data['updatedAt'] != null ? (data['updatedAt'] as Timestamp).toDate() : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'farmId': farmId,
      'cowId': cowId,
      'cowTag': cowTag,
      'date': date,
      'session': session,
      'quantityLitres': quantityLitres,
      'fatContent': fatContent,
      'snf': snf,
      'notes': notes,
      'recordedBy': recordedBy,
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': Timestamp.fromDate(updatedAt),
    };
  }
}
