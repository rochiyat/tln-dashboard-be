import {
  mysqlTable,
  bigint,
  varchar,
  text,
  smallint,
  tinyint,
  int,
  decimal,
  timestamp,
  char,
} from 'drizzle-orm/mysql-core';

export const userCvs = mysqlTable('user_cvs', {
  id: bigint('id', { mode: 'number', unsigned: true }).primaryKey(),
  userId: bigint('user_id', { mode: 'number', unsigned: true }),
  firestoreDocId: varchar('firestore_doc_id', { length: 255 }),
  nama: varchar('nama', { length: 255 }),
  displayName: varchar('display_name', { length: 255 }),
  applyCount: smallint('apply_count', { unsigned: true }).default(0),
  beratBadan: varchar('berat_badan', { length: 255 }).default('0'),
  celanaDiatasMataKaki: varchar('celana_diatas_mata_kaki', { length: 255 }),
  ciriFisikCatatan: text('ciri_fisik_catatan'),
  ciriFisikJenggot: text('ciri_fisik_jenggot'),
  ciriFisikJenisRambut: text('ciri_fisik_jenis_rambut'),
  ciriFisikPanjangRambut: text('ciri_fisik_panjang_rambut'),
  ciriFisikWajah: text('ciri_fisik_wajah'),
  ciriFisikWarnaKulit: text('ciri_fisik_warna_kulit'),
  ciriFisikWarnaRambut: text('ciri_fisik_warna_rambut'),
  ciriFisikByAdmin: varchar('ciri_fisik_by_admin', { length: 255 }).default(
    'unknown'
  ),
  cvPendingExpiry: bigint('cv_pending_expiry', {
    mode: 'number',
    unsigned: true,
  }).default(0),
  cvPublishExpiry: bigint('cv_publish_expiry', {
    mode: 'number',
    unsigned: true,
  }).default(0),
  cvPublishState: varchar('cv_publish_state', { length: 255 }),
  hasFirstPublished: tinyint('has_first_published').default(0),
  cvUnpublishedReason: text('cv_unpublished_reason'),
  referralId: varchar('referral_id', { length: 255 }),
  daerahAsal: text('daerah_asal'),
  originCityId: char('origin_city_id', { length: 4 }),
  originProvinceId: char('origin_province_id', { length: 2 }),
  domisili: text('domisili'),
  domicileCityId: char('domicile_city_id', { length: 4 }),
  domicileProvinceId: char('domicile_province_id', { length: 2 }),
  domicileLatitude: decimal('domicile_latitude', { precision: 11, scale: 8 }),
  domicileLongitude: decimal('domicile_longitude', { precision: 11, scale: 8 }),
  foto: text('foto'),
  fotoBlurred: text('foto_blurred'),
  fotoKtp: text('foto_ktp'),
  akteCerai: text('akte_cerai'),
  gender: varchar('gender', { length: 255 }),
  hasUnreadMessage: tinyint('has_unread_message').default(0),
  hobi: text('hobi'),
  isAdminApproved: tinyint('is_admin_approved').default(0),
  jumlahAnak: varchar('jumlah_anak', { length: 255 }),
  jumlahHafalanQuran: text('jumlah_hafalan_quran'),
  karakterDanSifat: text('karakter_dan_sifat'),
  parentPermission: varchar('parent_permission', { length: 255 }),
  kelompokNgaji: text('kelompok_ngaji'),
  kriteriaDomisili: text('kriteria_domisili'),
  kriteriaLainnya: text('kriteria_lainnya'),
  kriteriaPekerjaan: text('kriteria_pekerjaan'),
  kriteriaUmurAkhir: varchar('kriteria_umur_akhir', { length: 100 }),
  kriteriaUmurAwal: varchar('kriteria_umur_awal', { length: 100 }),
  lastUpdated: varchar('last_updated', { length: 255 }),
  lastSessionActive: varchar('last_session_active', { length: 255 }),
  membershipState: varchar('membership_state', { length: 255 }),
  vipStartDate: varchar('vip_start_date', { length: 255 }),
  vipEndDate: varchar('vip_end_date', { length: 255 }),
  menikahDenganPriaBeristri: varchar('menikah_dengan_pria_beristri', {
    length: 255,
  }),
  merokok: varchar('merokok', { length: 255 }),
  panjangJilbab: varchar('panjang_jilbab', { length: 255 }),
  pekerjaan: text('pekerjaan'),
  phone: varchar('phone', { length: 255 }),
  publicUid: varchar('public_uid', { length: 255 }),
  role: varchar('role', { length: 255 }),
  statusMenikah: varchar('status_menikah', { length: 255 }),
  suku: varchar('suku', { length: 255 }),
  targetMenikah: varchar('target_menikah', { length: 255 }),
  tempatLahir: varchar('tempat_lahir', { length: 255 }),
  tglLahir: varchar('tgl_lahir', { length: 255 }),
  tinggiBadan: varchar('tinggi_badan', { length: 255 }),
  uid: varchar('uid', { length: 255 }),
  viewCount: int('view_count', { unsigned: true }).default(0),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

export const taarufRequests = mysqlTable('taaruf_requests', {
  id: int('id').notNull().primaryKey(),
  firestoreDocId: varchar('firestore_doc_id', { length: 50 }).default(
    null as any
  ),
  requesterUserId: int('requester_user_id').default(null as any),
  requesterUid: varchar('requester_uid', { length: 50 }).default(null as any),
  requesterPublicUid: varchar('requester_public_uid', { length: 50 }).default(
    null as any
  ),
  requesterNama: varchar('requester_nama', { length: 50 }).default(null as any),
  requesterDisplayName: varchar('requester_display_name', {
    length: 50,
  }).default(null as any),
  requesterPhone: varchar('requester_phone', { length: 50 }).default(
    null as any
  ),
  receiverUserId: int('receiver_user_id').default(null as any),
  receiverUid: varchar('receiver_uid', { length: 50 }).default(null as any),
  receiverPublicUid: varchar('receiver_public_uid', { length: 50 }).default(
    null as any
  ),
  receiverNama: varchar('receiver_nama', { length: 50 }).default(null as any),
  receiverDisplayName: varchar('receiver_display_name', { length: 50 }).default(
    null as any
  ),
  receiverGender: varchar('receiver_gender', { length: 50 }).default(
    null as any
  ),
  receiverPhone: varchar('receiver_phone', { length: 50 }).default(null as any),
  requestStatus: varchar('request_status', { length: 50 }).default(null as any),
  shouldPendingTaaruf: int('should_pending_taaruf').default(null as any),
  roomName: varchar('room_name', { length: 50 }).default(null as any),
  roomUrl: varchar('room_url', { length: 50 }).default(null as any),
  requesterMadePromise: int('requester_made_promise').default(null as any),
  receiverMadePromise: int('receiver_made_promise').default(null as any),
  adminPhone: varchar('admin_phone', { length: 50 }).default(null as any),
  deadline: int('deadline').default(null as any),
  lastUpdated: int('last_updated').default(null as any),
  supportInAppChat: int('support_in_app_chat').default(null as any),
  conversationId: varchar('conversation_id', { length: 50 }).default(
    null as any
  ),
  taarufState: varchar('taaruf_state', { length: 50 }).default(null as any),
  createdAt: varchar('created_at', { length: 50 }).default(null as any),
  updatedAt: varchar('updated_at', { length: 50 }).default(null as any),
});
