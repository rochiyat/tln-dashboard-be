import { like, sql, or, desc, eq } from 'drizzle-orm';
import { userCvs } from '../schema/tln';
import { UserCvsRepository } from '@/domain/repositories/user-cvs-repository';
import { userCvsList, UserCvsEntity } from '@/domain/entities/user-cvs';
import { dbTln } from '../db-tln';

export class DrizzleUserCvsRepository implements UserCvsRepository {
  async findAll(
    limit: number,
    offset: number,
    query?: { key: string }
  ): Promise<userCvsList[]> {
    const conditions = [];
    const key = query?.key;
    if (key) {
      conditions.push(like(userCvs.nama, `%${query.key}%`));
      conditions.push(like(userCvs.publicUid, `%${query.key}%`));
    }

    const rows = await dbTln
      .select({
        id: userCvs.id,
        userId: userCvs.userId,
        firestoreDocId: userCvs.firestoreDocId,
        nama: userCvs.nama,
        cvPublishState: userCvs.cvPublishState,
        cvPublishExpiry: userCvs.cvPublishExpiry,
        cvPendingExpiry: userCvs.cvPendingExpiry,
        uid: userCvs.uid,
        publicUid: userCvs.publicUid,
      })
      .from(userCvs)
      .where(or(...conditions))
      .orderBy(desc(userCvs.updatedAt))
      .limit(limit)
      .offset(offset);
    console.log('conditions', conditions);

    return rows;
  }

  async count(query: { key: string }): Promise<number> {
    const conditions = [];
    const key = query?.key;

    if (key) {
      conditions.push(like(userCvs.nama, `%${query.key}%`));
      conditions.push(like(userCvs.publicUid, `${query.key}`));
    }
    const result = await dbTln
      .select({
        count: sql<number>`count(*)`,
      })
      .from(userCvs)
      .where(or(...conditions));

    return result[0].count;
  }

  async findByPublicUid(publicUid: string): Promise<UserCvsEntity | null> {
    const rows = await dbTln
      .select({
        id: userCvs.id,
        userId: userCvs.userId,
        firestoreDocId: userCvs.firestoreDocId,
        nama: userCvs.nama,
        displayName: userCvs.displayName,
        applyCount: userCvs.applyCount,
        beratBadan: userCvs.beratBadan,
        celanaDiatasMataKaki: userCvs.celanaDiatasMataKaki,
        ciriFisikCatatan: userCvs.ciriFisikCatatan,
        ciriFisikJenggot: userCvs.ciriFisikJenggot,
        ciriFisikJenisRambut: userCvs.ciriFisikJenisRambut,
        ciriFisikPanjangRambut: userCvs.ciriFisikPanjangRambut,
        ciriFisikWajah: userCvs.ciriFisikWajah,
        ciriFisikWarnaKulit: userCvs.ciriFisikWarnaKulit,
        ciriFisikWarnaRambut: userCvs.ciriFisikWarnaRambut,
        ciriFisikByAdmin: userCvs.ciriFisikByAdmin,
        cvPendingExpiry: userCvs.cvPendingExpiry,
        cvPublishExpiry: userCvs.cvPublishExpiry,
        cvPublishState: userCvs.cvPublishState,
        hasFirstPublished: userCvs.hasFirstPublished,
        cvUnpublishedReason: userCvs.cvUnpublishedReason,
        referralId: userCvs.referralId,
        daerahAsal: userCvs.daerahAsal,
        originCityId: userCvs.originCityId,
        originProvinceId: userCvs.originProvinceId,
        domisili: userCvs.domisili,
        domicileCityId: userCvs.domicileCityId,
        domicileProvinceId: userCvs.domicileProvinceId,
        domicileLatitude: userCvs.domicileLatitude,
        domicileLongitude: userCvs.domicileLongitude,
        foto: userCvs.foto,
        fotoBlurred: userCvs.fotoBlurred,
        fotoKtp: userCvs.fotoKtp,
        akteCerai: userCvs.akteCerai,
        gender: userCvs.gender,
        hasUnreadMessage: userCvs.hasUnreadMessage,
        hobi: userCvs.hobi,
        isAdminApproved: userCvs.isAdminApproved,
        jumlahAnak: userCvs.jumlahAnak,
        jumlahHafalanQuran: userCvs.jumlahHafalanQuran,
        karakterDanSifat: userCvs.karakterDanSifat,
        parentPermission: userCvs.parentPermission,
        kelompokNgaji: userCvs.kelompokNgaji,
        kriteriaDomisili: userCvs.kriteriaDomisili,
        kriteriaLainnya: userCvs.kriteriaLainnya,
        kriteriaPekerjaan: userCvs.kriteriaPekerjaan,
        kriteriaUmurAkhir: userCvs.kriteriaUmurAkhir,
        kriteriaUmurAwal: userCvs.kriteriaUmurAwal,
        lastUpdated: userCvs.lastUpdated,
        lastSessionActive: userCvs.lastSessionActive,
        membershipState: userCvs.membershipState,
        vipStartDate: userCvs.vipStartDate,
        vipEndDate: userCvs.vipEndDate,
        menikahDenganPriaBeristri: userCvs.menikahDenganPriaBeristri,
        merokok: userCvs.merokok,
        panjangJilbab: userCvs.panjangJilbab,
        pekerjaan: userCvs.pekerjaan,
        phone: userCvs.phone,
        publicUid: userCvs.publicUid,
        role: userCvs.role,
        statusMenikah: userCvs.statusMenikah,
        suku: userCvs.suku,
        targetMenikah: userCvs.targetMenikah,
        tempatLahir: userCvs.tempatLahir,
        tglLahir: userCvs.tglLahir,
        tinggiBadan: userCvs.tinggiBadan,
        uid: userCvs.uid,
        viewCount: userCvs.viewCount,
        createdAt: userCvs.createdAt,
        updatedAt: userCvs.updatedAt,
      })
      .from(userCvs)
      .where(eq(userCvs.publicUid, publicUid))
      .limit(1);
    return rows[0] || null;
  }
}
