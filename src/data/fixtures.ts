// Stubbed knowledge base for the first product milestone.
// Every screen reads from this module so it can later be swapped for the Netlify Database + API.
import type { Lang } from '@/lib/i18n'

export type L = Record<Lang, string>
export type Status = 'verified' | 'in_review' | 'ai_extracted'
export type ItemType = 'hadith' | 'ayah' | 'athar'
export type SourceType = 'quran' | 'hadith' | 'tafsir' | 'fiqh' | 'sirah' | 'adab'

export type Source = {
  id: string
  name: L
  author: L
  died?: number
  type: SourceType
  items: number
}

export type Concept = {
  id: string
  label: L
  synonyms: string[]
  related: string[]
}

export type Item = {
  id: string
  type: ItemType
  ar: string
  tr: { en: string; id: string }
  source: string
  ref: string
  alsoIn?: string
  narrator?: L
  grade?: L
  status: Status
  concepts: string[]
}

const sahih: L = { ar: 'صحيح', en: 'Sahih (authentic)', id: 'Sahih' }
const hasan: L = { ar: 'حسن', en: 'Hasan (good)', id: 'Hasan' }
const hasanSahih: L = { ar: 'حسن صحيح', en: 'Hasan sahih', id: 'Hasan sahih' }
const pending: L = { ar: 'بانتظار الحكم', en: 'Grading pending', id: 'Menunggu penilaian' }

const n = (ar: string, en: string, id = en): L => ({ ar, en, id })

export const sources: Source[] = [
  { id: 'quran', name: n('القرآن الكريم', 'The Noble Qur’an', 'Al-Qur’an al-Karim'), author: n('—', '—'), type: 'quran', items: 6236 },
  { id: 'bukhari', name: n('صحيح البخاري', 'Sahih al-Bukhari'), author: n('محمد بن إسماعيل البخاري', 'Muhammad ibn Ismail al-Bukhari'), died: 256, type: 'hadith', items: 7563 },
  { id: 'muslim', name: n('صحيح مسلم', 'Sahih Muslim'), author: n('مسلم بن الحجاج النيسابوري', 'Muslim ibn al-Hajjaj'), died: 261, type: 'hadith', items: 7470 },
  { id: 'abudawud', name: n('سنن أبي داود', 'Sunan Abi Dawud'), author: n('أبو داود السجستاني', 'Abu Dawud al-Sijistani'), died: 275, type: 'hadith', items: 5274 },
  { id: 'tirmidhi', name: n('جامع الترمذي', 'Jami‘ al-Tirmidhi'), author: n('محمد بن عيسى الترمذي', 'Muhammad ibn ‘Isa al-Tirmidhi'), died: 279, type: 'hadith', items: 3956 },
  { id: 'nasai', name: n('سنن النسائي', 'Sunan al-Nasa’i'), author: n('أحمد بن شعيب النسائي', 'Ahmad ibn Shu‘ayb al-Nasa’i'), died: 303, type: 'hadith', items: 5758 },
  { id: 'ibnmajah', name: n('سنن ابن ماجه', 'Sunan Ibn Majah'), author: n('محمد بن يزيد ابن ماجه', 'Muhammad ibn Yazid Ibn Majah'), died: 273, type: 'hadith', items: 4341 },
  { id: 'malik', name: n('موطأ الإمام مالك', 'Muwatta’ Malik'), author: n('مالك بن أنس', 'Malik ibn Anas'), died: 179, type: 'hadith', items: 1832 },
  { id: 'ahmad', name: n('مسند الإمام أحمد', 'Musnad Ahmad'), author: n('أحمد بن حنبل', 'Ahmad ibn Hanbal'), died: 241, type: 'hadith', items: 27647 },
  { id: 'adabmufrad', name: n('الأدب المفرد', 'Al-Adab al-Mufrad'), author: n('محمد بن إسماعيل البخاري', 'Muhammad ibn Ismail al-Bukhari'), died: 256, type: 'adab', items: 1322 },
  { id: 'riyad', name: n('رياض الصالحين', 'Riyad al-Salihin'), author: n('يحيى بن شرف النووي', 'Yahya ibn Sharaf al-Nawawi'), died: 676, type: 'adab', items: 1896 },
  { id: 'nawawi40', name: n('الأربعون النووية', 'Al-Arba‘in al-Nawawiyyah', 'Hadis Arbain Nawawi'), author: n('يحيى بن شرف النووي', 'Yahya ibn Sharaf al-Nawawi'), died: 676, type: 'hadith', items: 42 },
  { id: 'tabari', name: n('جامع البيان (تفسير الطبري)', 'Jami‘ al-Bayan (Tafsir al-Tabari)'), author: n('محمد بن جرير الطبري', 'Muhammad ibn Jarir al-Tabari'), died: 310, type: 'tafsir', items: 38397 },
  { id: 'ibnkathir', name: n('تفسير القرآن العظيم (ابن كثير)', 'Tafsir Ibn Kathir'), author: n('إسماعيل بن عمر بن كثير', 'Isma‘il ibn ‘Umar Ibn Kathir'), died: 774, type: 'tafsir', items: 6236 },
  { id: 'qurtubi', name: n('الجامع لأحكام القرآن (القرطبي)', 'Al-Jami‘ li-Ahkam al-Qur’an (al-Qurtubi)'), author: n('محمد بن أحمد القرطبي', 'Muhammad ibn Ahmad al-Qurtubi'), died: 671, type: 'tafsir', items: 6236 },
  { id: 'umdah', name: n('عمدة الأحكام', '‘Umdat al-Ahkam'), author: n('عبد الغني المقدسي', '‘Abd al-Ghani al-Maqdisi'), died: 600, type: 'fiqh', items: 430 },
  { id: 'bulugh', name: n('بلوغ المرام', 'Bulugh al-Maram'), author: n('ابن حجر العسقلاني', 'Ibn Hajar al-‘Asqalani'), died: 852, type: 'fiqh', items: 1596 },
  { id: 'ibnhisham', name: n('السيرة النبوية (ابن هشام)', 'Al-Sirah al-Nabawiyyah (Ibn Hisham)'), author: n('عبد الملك بن هشام', '‘Abd al-Malik ibn Hisham'), died: 213, type: 'sirah', items: 1150 },
  { id: 'raheeq', name: n('الرحيق المختوم', 'The Sealed Nectar', 'Ar-Rahiq al-Makhtum'), author: n('صفي الرحمن المباركفوري', 'Safiur-Rahman al-Mubarakpuri'), died: 1427, type: 'sirah', items: 640 },
]

export const concepts: Concept[] = [
  { id: 'niyyah', label: n('النية والإخلاص', 'Intention & sincerity', 'Niat & ikhlas'), synonyms: ['نية', 'نيات', 'اخلاص', 'قلب', 'قلوب', 'intention', 'sincerity', 'heart', 'niat', 'ikhlas', 'hati'], related: ['iman', 'akhlaq'] },
  { id: 'iman', label: n('الإيمان', 'Faith', 'Iman'), synonyms: ['ايمان', 'يؤمن', 'مؤمن', 'faith', 'belief', 'believer', 'iman', 'beriman', 'mukmin'], related: ['arkan', 'haya', 'niyyah', 'ukhuwwah'] },
  { id: 'arkan', label: n('أركان الإسلام', 'Pillars of Islam', 'Rukun Islam'), synonyms: ['اركان', 'صلاه', 'زكاه', 'صوم', 'حج', 'شهاده', 'pillars', 'prayer', 'zakat', 'fasting', 'hajj', 'rukun', 'shalat', 'puasa'], related: ['iman', 'tahara'] },
  { id: 'ilm', label: n('العلم وطلبه', 'Knowledge & learning', 'Ilmu & menuntut ilmu'), synonyms: ['علم', 'تعلم', 'معرفه', 'عالم', 'علماء', 'اقرا', 'knowledge', 'learn', 'learning', 'scholar', 'study', 'ilmu', 'belajar', 'ulama'], related: ['quran', 'tathabbut', 'dawah'] },
  { id: 'quran', label: n('القرآن الكريم', 'The Qur’an', 'Al-Qur’an'), synonyms: ['قران', 'تلاوه', 'اقرؤوا', 'quran', 'recite', 'recitation', 'tilawah', 'membaca'], related: ['ilm', 'dawah'] },
  { id: 'akhlaq', label: n('حسن الخلق', 'Good character', 'Akhlak mulia'), synonyms: ['خلق', 'اخلاق', 'ادب', 'character', 'manners', 'conduct', 'akhlak', 'adab', 'budi'], related: ['lisan', 'haya', 'rahmah', 'ghadab', 'taqwa'] },
  { id: 'rahmah', label: n('الرحمة والرفق', 'Mercy & gentleness', 'Rahmat & kelembutan'), synonyms: ['رحمه', 'رفق', 'لين', 'رافه', 'يرحم', 'mercy', 'compassion', 'gentle', 'gentleness', 'kindness', 'kind', 'rahmat', 'kasih', 'lembut', 'sayang'], related: ['yusr', 'akhlaq', 'dawah'] },
  { id: 'ghadab', label: n('الغضب وكظم الغيظ', 'Anger & restraint', 'Amarah & menahan diri'), synonyms: ['غضب', 'تغضب', 'غيظ', 'حلم', 'anger', 'angry', 'temper', 'restraint', 'marah', 'amarah', 'sabar'], related: ['akhlaq', 'taqwa'] },
  { id: 'sadaqah', label: n('الصدقة', 'Charity', 'Sedekah'), synonyms: ['صدقه', 'انفاق', 'مال', 'تبسم', 'charity', 'giving', 'smile', 'wealth', 'sedekah', 'infak', 'senyum'], related: ['lisan', 'ukhuwwah', 'arkan'] },
  { id: 'tahara', label: n('الطهارة', 'Purity', 'Bersuci'), synonyms: ['طهور', 'طهاره', 'وضوء', 'متطهرين', 'purity', 'purification', 'ablution', 'wudu', 'bersuci', 'thaharah', 'wudhu'], related: ['arkan', 'iman'] },
  { id: 'lisan', label: n('حفظ اللسان', 'Guarding the tongue', 'Menjaga lisan'), synonyms: ['لسان', 'كلمه', 'قول', 'يصمت', 'كذب', 'tongue', 'speech', 'words', 'silent', 'lie', 'lisan', 'ucapan', 'diam', 'bohong'], related: ['akhlaq', 'tathabbut', 'sadaqah'] },
  { id: 'tathabbut', label: n('التثبت والتحقق', 'Verification', 'Tabayyun & verifikasi'), synonyms: ['تثبت', 'تبين', 'تبينوا', 'اسناد', 'تحقق', 'نبا', 'verify', 'verification', 'news', 'isnad', 'source', 'tabayyun', 'periksa', 'berita', 'sumber'], related: ['ilm', 'lisan'] },
  { id: 'haya', label: n('الحياء', 'Modesty', 'Malu'), synonyms: ['حياء', 'modesty', 'shyness', 'malu'], related: ['iman', 'akhlaq'] },
  { id: 'yusr', label: n('التيسير', 'Ease', 'Kemudahan'), synonyms: ['يسر', 'يسروا', 'تيسير', 'عسر', 'ease', 'easy', 'hardship', 'mudah', 'kemudahan'], related: ['rahmah', 'dawah'] },
  { id: 'ukhuwwah', label: n('الأخوة', 'Brotherhood', 'Persaudaraan'), synonyms: ['اخ', 'اخيه', 'اخوه', 'بنيان', 'brother', 'brotherhood', 'unity', 'saudara', 'persaudaraan'], related: ['iman', 'sadaqah', 'taqwa'] },
  { id: 'dawah', label: n('الدعوة والتبليغ', 'Da‘wah', 'Dakwah'), synonyms: ['دعوه', 'ادع', 'بلغوا', 'حكمه', 'موعظه', 'invite', 'convey', 'wisdom', 'preach', 'dakwah', 'hikmah', 'sampaikan'], related: ['ilm', 'yusr', 'rahmah'] },
  { id: 'taqwa', label: n('التقوى', 'God-consciousness', 'Takwa'), synonyms: ['تقوى', 'اتق', 'taqwa', 'piety', 'righteousness', 'takwa', 'kebajikan'], related: ['akhlaq', 'ghadab', 'ukhuwwah'] },
  { id: 'nasiha', label: n('النصيحة', 'Sincere advice', 'Nasihat'), synonyms: ['نصيحه', 'نصح', 'advice', 'sincere', 'counsel', 'nasihat'], related: ['dawah', 'ukhuwwah'] },
  { id: 'birr', label: n('بر الوالدين', 'Honouring parents', 'Berbakti kepada orang tua'), synonyms: ['والدين', 'الوالدين', 'والد', 'والده', 'امك', 'ابوك', 'امي', 'ابي', 'ام', 'اب', 'parents', 'parent', 'mother', 'father', 'orang tua', 'ibu', 'ayah', 'birrul walidain', 'berbakti'], related: ['rahim', 'rahmah'] },
  { id: 'rahim', label: n('صلة الرحم', 'Ties of kinship', 'Silaturahmi'), synonyms: ['رحم', 'ارحام', 'الارحام', 'صله', 'قاطع', 'قطيعه', 'اقارب', 'قرابه', 'kinship', 'relatives', 'family ties', 'kin', 'relations', 'silaturahmi', 'silaturahim', 'kerabat', 'keluarga'], related: ['birr', 'jar'] },
  { id: 'sabr', label: n('الصبر', 'Patience', 'Kesabaran'), synonyms: ['صبر', 'صابرين', 'صبور', 'ابتلاء', 'بلاء', 'مصيبه', 'patience', 'patient', 'perseverance', 'trial', 'sabar', 'kesabaran', 'musibah', 'cobaan'], related: ['ghadab', 'dua'] },
  { id: 'dua', label: n('الدعاء', 'Supplication', 'Doa'), synonyms: ['دعاء', 'ادعوني', 'استجب', 'اجيب', 'supplication', 'dua', 'du‘a', 'doa', 'berdoa'], related: ['dhikr', 'tawbah'] },
  { id: 'jar', label: n('حق الجار', 'Rights of the neighbour', 'Hak tetangga'), synonyms: ['جار', 'جيران', 'neighbour', 'neighbor', 'neighbours', 'neighbors', 'tetangga'], related: ['rahim', 'akhlaq'] },
  { id: 'sidq', label: n('الصدق', 'Truthfulness', 'Kejujuran'), synonyms: ['صدق', 'صادق', 'صادقين', 'honesty', 'truthfulness', 'truthful', 'honest', 'jujur', 'kejujuran'], related: ['lisan', 'akhlaq'] },
  { id: 'tawbah', label: n('التوبة والاستغفار', 'Repentance & forgiveness', 'Taubat & istighfar'), synonyms: ['توبه', 'تاب', 'تائب', 'توابين', 'استغفار', 'مغفره', 'يغفر', 'ذنوب', 'ذنب', 'repentance', 'repent', 'forgiveness', 'sin', 'sins', 'taubat', 'tobat', 'ampunan', 'dosa', 'istighfar'], related: ['dua', 'rahmah'] },
  { id: 'dhikr', label: n('ذكر الله', 'Remembrance of Allah', 'Dzikir'), synonyms: ['ذكر', 'اذكار', 'تسبيح', 'سبحان', 'remembrance', 'dhikr', 'zikr', 'tasbih', 'zikir', 'dzikir'], related: ['dua', 'quran'] },
  { id: 'yatim', label: n('كفالة اليتيم', 'Caring for orphans', 'Menyantuni anak yatim'), synonyms: ['يتيم', 'ايتام', 'كافل', 'كفاله', 'orphan', 'orphans', 'yatim', 'anak yatim'], related: ['rahmah', 'sadaqah'] },
]

const abuHurayrah = n('أبو هريرة رضي الله عنه', 'Abu Hurayrah (ra)', 'Abu Hurairah ra')
const anas = n('أنس بن مالك رضي الله عنه', 'Anas ibn Malik (ra)', 'Anas bin Malik ra')
const ibnUmar = n('عبد الله بن عمر رضي الله عنهما', '‘Abdullah ibn ‘Umar (ra)', 'Abdullah bin Umar ra')
const ibnAmr = n('عبد الله بن عمرو رضي الله عنهما', '‘Abdullah ibn ‘Amr (ra)', 'Abdullah bin Amr ra')
const abuDharr = n('أبو ذر الغفاري رضي الله عنه', 'Abu Dharr al-Ghifari (ra)', 'Abu Dzar al-Ghifari ra')

export const items: Item[] = [
  // ---------- Hadith ----------
  { id: 'h-001', type: 'hadith', ar: '«إنما الأعمالُ بالنيات، وإنما لكل امرئٍ ما نوى»', tr: { en: '“Actions are only by intentions, and every person will have only what they intended.”', id: '“Sesungguhnya amal itu tergantung niatnya, dan setiap orang hanya mendapatkan apa yang ia niatkan.”' }, source: 'bukhari', ref: '1', alsoIn: 'مسلم ١٩٠٧', narrator: n('عمر بن الخطاب رضي الله عنه', '‘Umar ibn al-Khattab (ra)', 'Umar bin Khattab ra'), grade: sahih, status: 'verified', concepts: ['niyyah', 'iman'] },
  { id: 'h-002', type: 'hadith', ar: '«بُني الإسلامُ على خمس: شهادةِ أن لا إله إلا الله وأن محمدًا رسول الله، وإقامِ الصلاة، وإيتاءِ الزكاة، والحج، وصومِ رمضان»', tr: { en: '“Islam is built on five: testifying that there is no god but Allah and that Muhammad is the Messenger of Allah, establishing prayer, giving zakat, Hajj, and fasting Ramadan.”', id: '“Islam dibangun di atas lima perkara: bersaksi bahwa tiada tuhan selain Allah dan Muhammad utusan Allah, mendirikan shalat, menunaikan zakat, haji, dan puasa Ramadhan.”' }, source: 'bukhari', ref: '8', alsoIn: 'مسلم ١٦', narrator: ibnUmar, grade: sahih, status: 'verified', concepts: ['arkan', 'iman'] },
  { id: 'h-003', type: 'hadith', ar: '«لا يؤمنُ أحدُكم حتى يحبَّ لأخيه ما يحبُّ لنفسه»', tr: { en: '“None of you truly believes until he loves for his brother what he loves for himself.”', id: '“Tidak sempurna iman salah seorang di antara kalian hingga ia mencintai untuk saudaranya apa yang ia cintai untuk dirinya sendiri.”' }, source: 'bukhari', ref: '13', alsoIn: 'مسلم ٤٥', narrator: anas, grade: sahih, status: 'verified', concepts: ['iman', 'ukhuwwah'] },
  { id: 'h-004', type: 'hadith', ar: '«الدينُ النصيحة» قلنا: لمن؟ قال: «لله ولكتابه ولرسوله ولأئمة المسلمين وعامتهم»', tr: { en: '“The religion is sincere advice.” We said: “To whom?” He said: “To Allah, His Book, His Messenger, the leaders of the Muslims and their common folk.”', id: '“Agama adalah nasihat.” Kami bertanya: “Untuk siapa?” Beliau bersabda: “Untuk Allah, Kitab-Nya, Rasul-Nya, para pemimpin kaum muslimin, dan umat mereka.”' }, source: 'muslim', ref: '55', narrator: n('تميم الداري رضي الله عنه', 'Tamim al-Dari (ra)', 'Tamim ad-Dari ra'), grade: sahih, status: 'verified', concepts: ['nasiha', 'dawah'] },
  { id: 'h-005', type: 'hadith', ar: '«من كان يؤمنُ بالله واليوم الآخر فليقلْ خيرًا أو ليصمتْ»', tr: { en: '“Whoever believes in Allah and the Last Day, let him speak good or remain silent.”', id: '“Barang siapa beriman kepada Allah dan hari akhir, hendaklah ia berkata baik atau diam.”' }, source: 'bukhari', ref: '6018', alsoIn: 'مسلم ٤٧', narrator: abuHurayrah, grade: sahih, status: 'verified', concepts: ['lisan', 'akhlaq', 'iman'] },
  { id: 'h-006', type: 'hadith', ar: '«الطُّهورُ شطرُ الإيمان، والحمدُ لله تملأُ الميزان»', tr: { en: '“Purity is half of faith, and ‘al-hamdu lillah’ fills the scale.”', id: '“Bersuci adalah separuh iman, dan ‘alhamdulillah’ memenuhi timbangan.”' }, source: 'muslim', ref: '223', narrator: n('أبو مالك الأشعري رضي الله عنه', 'Abu Malik al-Ash‘ari (ra)', 'Abu Malik al-Asy‘ari ra'), grade: sahih, status: 'verified', concepts: ['tahara', 'iman'] },
  { id: 'h-007', type: 'hadith', ar: '«المسلمُ من سلمَ المسلمون من لسانه ويده»', tr: { en: '“The Muslim is the one from whose tongue and hand the Muslims are safe.”', id: '“Muslim adalah orang yang kaum muslimin selamat dari lisan dan tangannya.”' }, source: 'bukhari', ref: '10', alsoIn: 'مسلم ٤٠', narrator: ibnAmr, grade: sahih, status: 'verified', concepts: ['lisan', 'akhlaq'] },
  { id: 'h-008', type: 'hadith', ar: 'أن رجلًا قال للنبي ﷺ: أوصني، قال: «لا تغضب»، فردَّد مرارًا، قال: «لا تغضب»', tr: { en: 'A man said to the Prophet ﷺ: “Advise me.” He said: “Do not become angry.” The man repeated it several times, and he said: “Do not become angry.”', id: 'Seorang lelaki berkata kepada Nabi ﷺ: “Berilah aku wasiat.” Beliau bersabda: “Jangan marah.” Ia mengulanginya beberapa kali, beliau tetap bersabda: “Jangan marah.”' }, source: 'bukhari', ref: '6116', narrator: abuHurayrah, grade: sahih, status: 'verified', concepts: ['ghadab', 'akhlaq'] },
  { id: 'h-009', type: 'hadith', ar: '«اتقِ اللهَ حيثما كنت، وأتبعِ السيئةَ الحسنةَ تمحُها، وخالقِ الناسَ بخلقٍ حسن»', tr: { en: '“Be mindful of Allah wherever you are, follow a bad deed with a good one to erase it, and treat people with good character.”', id: '“Bertakwalah kepada Allah di mana pun engkau berada, iringilah keburukan dengan kebaikan niscaya ia menghapusnya, dan pergaulilah manusia dengan akhlak yang baik.”' }, source: 'tirmidhi', ref: '1987', narrator: abuDharr, grade: hasan, status: 'verified', concepts: ['taqwa', 'akhlaq'] },
  { id: 'h-010', type: 'hadith', ar: '«من حُسنِ إسلامِ المرءِ تركُه ما لا يعنيه»', tr: { en: '“Part of the excellence of a person’s Islam is leaving what does not concern him.”', id: '“Di antara tanda baiknya keislaman seseorang adalah meninggalkan apa yang tidak bermanfaat baginya.”' }, source: 'tirmidhi', ref: '2317', narrator: abuHurayrah, grade: hasan, status: 'verified', concepts: ['akhlaq', 'lisan'] },
  { id: 'h-011', type: 'hadith', ar: '«طلبُ العلمِ فريضةٌ على كلِّ مسلم»', tr: { en: '“Seeking knowledge is an obligation upon every Muslim.”', id: '“Menuntut ilmu itu wajib atas setiap muslim.”' }, source: 'ibnmajah', ref: '224', narrator: anas, grade: n('صحّحه الألباني', 'Graded sahih by al-Albani', 'Disahihkan al-Albani'), status: 'in_review', concepts: ['ilm'] },
  { id: 'h-012', type: 'hadith', ar: '«من سلكَ طريقًا يلتمسُ فيه علمًا سهَّلَ اللهُ له به طريقًا إلى الجنة»', tr: { en: '“Whoever takes a path seeking knowledge, Allah makes easy for him a path to Paradise.”', id: '“Barang siapa menempuh jalan untuk mencari ilmu, Allah mudahkan baginya jalan menuju surga.”' }, source: 'muslim', ref: '2699', narrator: abuHurayrah, grade: sahih, status: 'verified', concepts: ['ilm'] },
  { id: 'h-013', type: 'hadith', ar: '«خيرُكم من تعلَّمَ القرآنَ وعلَّمه»', tr: { en: '“The best of you are those who learn the Qur’an and teach it.”', id: '“Sebaik-baik kalian adalah yang mempelajari Al-Qur’an dan mengajarkannya.”' }, source: 'bukhari', ref: '5027', narrator: n('عثمان بن عفان رضي الله عنه', '‘Uthman ibn ‘Affan (ra)', 'Utsman bin Affan ra'), grade: sahih, status: 'verified', concepts: ['quran', 'ilm'] },
  { id: 'h-014', type: 'hadith', ar: '«والكلمةُ الطيبةُ صدقة»', tr: { en: '“A good word is charity.”', id: '“Kata-kata yang baik adalah sedekah.”' }, source: 'bukhari', ref: '2989', alsoIn: 'مسلم ١٠٠٩', narrator: abuHurayrah, grade: sahih, status: 'verified', concepts: ['sadaqah', 'lisan'] },
  { id: 'h-015', type: 'hadith', ar: '«إن اللهَ رفيقٌ يحبُّ الرفقَ في الأمرِ كلِّه»', tr: { en: '“Allah is Gentle and loves gentleness in all matters.”', id: '“Sesungguhnya Allah Maha Lembut dan mencintai kelembutan dalam segala urusan.”' }, source: 'bukhari', ref: '6927', alsoIn: 'مسلم ٢١٦٥', narrator: n('عائشة رضي الله عنها', '‘A’ishah (ra)', 'Aisyah ra'), grade: sahih, status: 'verified', concepts: ['rahmah', 'yusr'] },
  { id: 'h-016', type: 'hadith', ar: '«تبسُّمُك في وجهِ أخيك لك صدقة»', tr: { en: '“Your smiling in the face of your brother is charity for you.”', id: '“Senyummu di hadapan saudaramu adalah sedekah bagimu.”' }, source: 'tirmidhi', ref: '1956', narrator: abuDharr, grade: hasan, status: 'verified', concepts: ['sadaqah', 'ukhuwwah'] },
  { id: 'h-017', type: 'hadith', ar: '«الحياءُ من الإيمان»', tr: { en: '“Modesty is part of faith.”', id: '“Malu adalah bagian dari iman.”' }, source: 'bukhari', ref: '24', alsoIn: 'مسلم ٣٦', narrator: ibnUmar, grade: sahih, status: 'verified', concepts: ['haya', 'iman'] },
  { id: 'h-018', type: 'hadith', ar: '«يسِّروا ولا تعسِّروا، وبشِّروا ولا تنفِّروا»', tr: { en: '“Make things easy and do not make them difficult; give glad tidings and do not drive people away.”', id: '“Permudahlah dan jangan mempersulit, berilah kabar gembira dan jangan membuat orang lari.”' }, source: 'bukhari', ref: '69', alsoIn: 'مسلم ١٧٣٤', narrator: anas, grade: sahih, status: 'verified', concepts: ['yusr', 'dawah'] },
  { id: 'h-019', type: 'hadith', ar: '«ليس الشديدُ بالصُّرَعة، إنما الشديدُ الذي يملكُ نفسَه عند الغضب»', tr: { en: '“The strong one is not the one who overpowers others in wrestling; the strong one is he who controls himself when angry.”', id: '“Orang kuat bukanlah yang pandai bergulat, tetapi orang kuat adalah yang mampu menguasai dirinya ketika marah.”' }, source: 'bukhari', ref: '6114', alsoIn: 'مسلم ٢٦٠٩', narrator: abuHurayrah, grade: sahih, status: 'verified', concepts: ['ghadab', 'akhlaq'] },
  { id: 'h-020', type: 'hadith', ar: '«من لا يَرحمُ لا يُرحم»', tr: { en: '“Whoever does not show mercy will not be shown mercy.”', id: '“Barang siapa tidak menyayangi, ia tidak akan disayangi.”' }, source: 'bukhari', ref: '5997', alsoIn: 'مسلم ٢٣١٨', narrator: abuHurayrah, grade: sahih, status: 'verified', concepts: ['rahmah'] },
  { id: 'h-021', type: 'hadith', ar: '«الراحمون يرحمُهم الرحمن، ارحموا من في الأرض يرحمْكم من في السماء»', tr: { en: '“The merciful are shown mercy by the Most Merciful. Be merciful to those on earth, and the One above the heavens will be merciful to you.”', id: '“Orang-orang yang penyayang akan disayangi oleh Ar-Rahman. Sayangilah yang ada di bumi, niscaya Yang di langit menyayangi kalian.”' }, source: 'tirmidhi', ref: '1924', narrator: ibnAmr, grade: hasanSahih, status: 'in_review', concepts: ['rahmah'] },
  { id: 'h-022', type: 'hadith', ar: '«ما نقصتْ صدقةٌ من مال، وما زاد اللهُ عبدًا بعفوٍ إلا عزًّا»', tr: { en: '“Charity does not decrease wealth, and Allah increases a servant who forgives only in honour.”', id: '“Sedekah tidak mengurangi harta, dan Allah tidak menambah seorang hamba yang pemaaf kecuali kemuliaan.”' }, source: 'muslim', ref: '2588', narrator: abuHurayrah, grade: sahih, status: 'verified', concepts: ['sadaqah', 'akhlaq'] },
  { id: 'h-023', type: 'hadith', ar: '«كفى بالمرءِ كذبًا أن يحدِّثَ بكلِّ ما سمع»', tr: { en: '“It is enough of a lie for a person to narrate everything he hears.”', id: '“Cukuplah seseorang dianggap berdusta bila ia menceritakan semua yang ia dengar.”' }, source: 'muslim', ref: 'المقدمة ٥', narrator: abuHurayrah, grade: sahih, status: 'verified', concepts: ['tathabbut', 'lisan'] },
  { id: 'h-024', type: 'hadith', ar: '«بلِّغوا عني ولو آية»', tr: { en: '“Convey from me, even if it is a single verse.”', id: '“Sampaikanlah dariku walau hanya satu ayat.”' }, source: 'bukhari', ref: '3461', narrator: ibnAmr, grade: sahih, status: 'verified', concepts: ['dawah', 'ilm'] },
  { id: 'h-025', type: 'hadith', ar: '«إن اللهَ لا ينظرُ إلى صورِكم وأموالِكم، ولكن ينظرُ إلى قلوبِكم وأعمالِكم»', tr: { en: '“Allah does not look at your forms or your wealth, but He looks at your hearts and your deeds.”', id: '“Sesungguhnya Allah tidak melihat rupa dan harta kalian, tetapi Dia melihat hati dan amal kalian.”' }, source: 'muslim', ref: '2564', narrator: abuHurayrah, grade: sahih, status: 'verified', concepts: ['niyyah'] },
  { id: 'h-026', type: 'hadith', ar: '«اقرؤوا القرآنَ؛ فإنه يأتي يومَ القيامةِ شفيعًا لأصحابه»', tr: { en: '“Recite the Qur’an, for it will come on the Day of Resurrection as an intercessor for its companions.”', id: '“Bacalah Al-Qur’an, karena ia akan datang pada hari kiamat sebagai pemberi syafaat bagi para pembacanya.”' }, source: 'muslim', ref: '804', narrator: n('أبو أمامة الباهلي رضي الله عنه', 'Abu Umamah al-Bahili (ra)', 'Abu Umamah al-Bahili ra'), grade: sahih, status: 'verified', concepts: ['quran'] },
  { id: 'h-027', type: 'hadith', ar: '«المؤمنُ للمؤمنِ كالبنيانِ يشدُّ بعضُه بعضًا»', tr: { en: '“A believer to another believer is like a building whose parts support one another.”', id: '“Seorang mukmin bagi mukmin lainnya bagaikan bangunan yang saling menguatkan satu sama lain.”' }, source: 'bukhari', ref: '481', alsoIn: 'مسلم ٢٥٨٥', narrator: n('أبو موسى الأشعري رضي الله عنه', 'Abu Musa al-Ash‘ari (ra)', 'Abu Musa al-Asy‘ari ra'), grade: sahih, status: 'verified', concepts: ['ukhuwwah', 'iman'] },
  { id: 'h-028', type: 'hadith', ar: '«إنما بُعثتُ لأتمِّمَ صالحَ الأخلاق»', tr: { en: '“I was only sent to perfect righteous character.”', id: '“Sesungguhnya aku diutus untuk menyempurnakan akhlak yang baik.”' }, source: 'adabmufrad', ref: '273', alsoIn: 'مسند أحمد ٨٩٥٢', narrator: abuHurayrah, grade: pending, status: 'ai_extracted', concepts: ['akhlaq'] },
  { id: 'h-029', type: 'hadith', ar: '«أكملُ المؤمنين إيمانًا أحسنُهم خُلقًا»', tr: { en: '“The most complete of the believers in faith are those best in character.”', id: '“Orang mukmin yang paling sempurna imannya adalah yang paling baik akhlaknya.”' }, source: 'abudawud', ref: '4682', alsoIn: 'الترمذي ١١٦٢', narrator: abuHurayrah, grade: hasanSahih, status: 'in_review', concepts: ['akhlaq', 'iman'] },
  { id: 'h-030', type: 'hadith', ar: '«من يُردِ اللهُ به خيرًا يفقِّهْه في الدين»', tr: { en: '“When Allah wills good for someone, He gives him understanding of the religion.”', id: '“Barang siapa yang Allah kehendaki kebaikan, Dia akan memahamkannya dalam urusan agama.”' }, source: 'bukhari', ref: '71', alsoIn: 'مسلم ١٠٣٧', narrator: n('معاوية بن أبي سفيان رضي الله عنه', 'Mu‘awiyah ibn Abi Sufyan (ra)', 'Muawiyah bin Abi Sufyan ra'), grade: sahih, status: 'verified', concepts: ['ilm'] },

  // ---------- Qur'an ----------
  { id: 'q-001', type: 'ayah', ar: '﴿اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ﴾', tr: { en: '“Read in the name of your Lord who created.”', id: '“Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan.”' }, source: 'quran', ref: 'العلق ٩٦:١', status: 'verified', concepts: ['ilm', 'quran'] },
  { id: 'q-002', type: 'ayah', ar: '﴿وَقُل رَّبِّ زِدْنِي عِلْمًا﴾', tr: { en: '“And say: My Lord, increase me in knowledge.”', id: '“Dan katakanlah: Ya Tuhanku, tambahkanlah ilmu kepadaku.”' }, source: 'quran', ref: 'طه ٢٠:١١٤', status: 'verified', concepts: ['ilm'] },
  { id: 'q-003', type: 'ayah', ar: '﴿يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ﴾', tr: { en: '“Allah will raise those who believe among you and those given knowledge, by degrees.”', id: '“Allah akan mengangkat orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu beberapa derajat.”' }, source: 'quran', ref: 'المجادلة ٥٨:١١', status: 'verified', concepts: ['ilm', 'iman'] },
  { id: 'q-004', type: 'ayah', ar: '﴿يَا أَيُّهَا الَّذِينَ آمَنُوا إِن جَاءَكُمْ فَاسِقٌ بِنَبَإٍ فَتَبَيَّنُوا﴾', tr: { en: '“O you who believe, if a wrongdoer brings you news, verify it.”', id: '“Wahai orang-orang yang beriman, jika datang kepadamu orang fasik membawa berita, maka telitilah.”' }, source: 'quran', ref: 'الحجرات ٤٩:٦', status: 'verified', concepts: ['tathabbut'] },
  { id: 'q-005', type: 'ayah', ar: '﴿وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ ۖ وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ﴾', tr: { en: '“Cooperate in righteousness and piety, and do not cooperate in sin and aggression.”', id: '“Tolong-menolonglah kamu dalam kebajikan dan takwa, dan jangan tolong-menolong dalam dosa dan permusuhan.”' }, source: 'quran', ref: 'المائدة ٥:٢', status: 'verified', concepts: ['taqwa', 'ukhuwwah'] },
  { id: 'q-006', type: 'ayah', ar: '﴿ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ﴾', tr: { en: '“Invite to the way of your Lord with wisdom and good instruction.”', id: '“Serulah (manusia) kepada jalan Tuhanmu dengan hikmah dan pengajaran yang baik.”' }, source: 'quran', ref: 'النحل ١٦:١٢٥', status: 'verified', concepts: ['dawah'] },
  { id: 'q-007', type: 'ayah', ar: '﴿فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ﴾', tr: { en: '“So ask the people of knowledge if you do not know.”', id: '“Maka bertanyalah kepada orang yang mempunyai pengetahuan jika kamu tidak mengetahui.”' }, source: 'quran', ref: 'النحل ١٦:٤٣', status: 'verified', concepts: ['ilm', 'tathabbut'] },
  { id: 'q-008', type: 'ayah', ar: '﴿فَبِمَا رَحْمَةٍ مِّنَ اللَّهِ لِنتَ لَهُمْ ۖ وَلَوْ كُنتَ فَظًّا غَلِيظَ الْقَلْبِ لَانفَضُّوا مِنْ حَوْلِكَ﴾', tr: { en: '“By mercy from Allah you were gentle with them; had you been harsh and hard-hearted, they would have dispersed from around you.”', id: '“Maka berkat rahmat Allah engkau berlaku lemah lembut terhadap mereka. Sekiranya engkau bersikap keras dan berhati kasar, tentulah mereka menjauhkan diri dari sekitarmu.”' }, source: 'quran', ref: 'آل عمران ٣:١٥٩', status: 'verified', concepts: ['rahmah', 'dawah'] },
  { id: 'q-009', type: 'ayah', ar: '﴿وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ ۗ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ﴾', tr: { en: '“…who restrain anger and pardon people — and Allah loves those who do good.”', id: '“…dan orang-orang yang menahan amarahnya dan memaafkan (kesalahan) orang lain. Dan Allah mencintai orang yang berbuat kebaikan.”' }, source: 'quran', ref: 'آل عمران ٣:١٣٤', status: 'verified', concepts: ['ghadab', 'akhlaq'] },
  { id: 'q-010', type: 'ayah', ar: '﴿يُرِيدُ اللَّهُ بِكُمُ الْيُسْرَ وَلَا يُرِيدُ بِكُمُ الْعُسْرَ﴾', tr: { en: '“Allah intends ease for you and does not intend hardship for you.”', id: '“Allah menghendaki kemudahan bagimu dan tidak menghendaki kesukaran bagimu.”' }, source: 'quran', ref: 'البقرة ٢:١٨٥', status: 'verified', concepts: ['yusr'] },
  { id: 'q-011', type: 'ayah', ar: '﴿وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ﴾', tr: { en: '“And indeed, you are of a great moral character.”', id: '“Dan sesungguhnya engkau benar-benar berbudi pekerti yang agung.”' }, source: 'quran', ref: 'القلم ٦٨:٤', status: 'verified', concepts: ['akhlaq'] },
  { id: 'q-012', type: 'ayah', ar: '﴿إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ﴾', tr: { en: '“The believers are but brothers.”', id: '“Sesungguhnya orang-orang mukmin itu bersaudara.”' }, source: 'quran', ref: 'الحجرات ٤٩:١٠', status: 'verified', concepts: ['ukhuwwah', 'iman'] },
  { id: 'q-013', type: 'ayah', ar: '﴿وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ﴾', tr: { en: '“And We have not sent you except as a mercy to the worlds.”', id: '“Dan Kami tidak mengutus engkau melainkan sebagai rahmat bagi seluruh alam.”' }, source: 'quran', ref: 'الأنبياء ٢١:١٠٧', status: 'verified', concepts: ['rahmah'] },
  { id: 'q-014', type: 'ayah', ar: '﴿إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ﴾', tr: { en: '“Indeed, Allah loves those who repent and loves those who purify themselves.”', id: '“Sungguh, Allah menyukai orang yang bertobat dan menyukai orang yang menyucikan diri.”' }, source: 'quran', ref: 'البقرة ٢:٢٢٢', status: 'verified', concepts: ['tawbah', 'tahara'] },
  { id: 'q-015', type: 'ayah', ar: '﴿وَلَا تَقْفُ مَا لَيْسَ لَكَ بِهِ عِلْمٌ﴾', tr: { en: '“And do not pursue that of which you have no knowledge.”', id: '“Dan janganlah kamu mengikuti sesuatu yang tidak kamu ketahui.”' }, source: 'quran', ref: 'الإسراء ١٧:٣٦', status: 'verified', concepts: ['tathabbut', 'ilm'] },
  { id: 'q-016', type: 'ayah', ar: '﴿إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ﴾', tr: { en: '“Only those among His servants who have knowledge truly fear Allah.”', id: '“Sesungguhnya yang takut kepada Allah di antara hamba-hamba-Nya hanyalah para ulama.”' }, source: 'quran', ref: 'فاطر ٣٥:٢٨', status: 'verified', concepts: ['ilm', 'taqwa'] },

  // ---------- Athar ----------
  { id: 'a-001', type: 'athar', ar: 'قال محمد بن سيرين: «إن هذا العلمَ دين، فانظروا عمّن تأخذون دينَكم»', tr: { en: 'Muhammad ibn Sirin said: “This knowledge is religion, so look carefully at whom you take your religion from.”', id: 'Muhammad bin Sirin berkata: “Ilmu ini adalah agama, maka perhatikanlah dari siapa kalian mengambil agama kalian.”' }, source: 'muslim', ref: 'المقدمة', narrator: n('محمد بن سيرين', 'Muhammad ibn Sirin', 'Muhammad bin Sirin'), status: 'verified', concepts: ['tathabbut', 'ilm'] },
  { id: 'a-002', type: 'athar', ar: 'قال عبد الله بن المبارك: «الإسنادُ من الدين، ولولا الإسنادُ لقال من شاء ما شاء»', tr: { en: '‘Abdullah ibn al-Mubarak said: “The isnad is part of the religion; were it not for the isnad, anyone could say whatever they wished.”', id: 'Abdullah bin al-Mubarak berkata: “Sanad adalah bagian dari agama; seandainya tidak ada sanad, siapa pun akan berkata sesukanya.”' }, source: 'muslim', ref: 'المقدمة', narrator: n('عبد الله بن المبارك', '‘Abdullah ibn al-Mubarak', 'Abdullah bin al-Mubarak'), status: 'verified', concepts: ['tathabbut'] },
  { id: 'a-003', type: 'athar', ar: 'قال الإمام مالك: «كلٌّ يؤخذُ من قوله ويُردّ إلا صاحبَ هذا القبر ﷺ»', tr: { en: 'Imam Malik said: “Everyone’s words may be accepted or rejected, except the occupant of this grave ﷺ.”', id: 'Imam Malik berkata: “Setiap perkataan bisa diambil dan ditolak, kecuali (perkataan) penghuni kubur ini ﷺ.”' }, source: 'malik', ref: '—', narrator: n('مالك بن أنس', 'Malik ibn Anas', 'Malik bin Anas'), status: 'ai_extracted', concepts: ['tathabbut', 'ilm'] },

  // Family, character and worship topics
  { id: 'q-017', type: 'ayah', ar: '﴿وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا﴾', tr: { en: '“Your Lord has decreed that you worship none but Him, and that you be good to your parents.”', id: '“Dan Tuhanmu telah memerintahkan agar kamu jangan menyembah selain Dia dan hendaklah berbuat baik kepada ibu bapak.”' }, source: 'quran', ref: 'الإسراء ١٧:٢٣', status: 'verified', concepts: ['birr'] },
  { id: 'q-018', type: 'ayah', ar: '﴿وَاخْفِضْ لَهُمَا جَنَاحَ الذُّلِّ مِنَ الرَّحْمَةِ وَقُل رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا﴾', tr: { en: '“And lower to them the wing of humility out of mercy, and say: My Lord, have mercy on them as they raised me when I was small.”', id: '“Dan rendahkanlah dirimu terhadap keduanya dengan penuh kasih sayang, dan ucapkanlah: Wahai Tuhanku, sayangilah keduanya sebagaimana mereka mendidikku pada waktu kecil.”' }, source: 'quran', ref: 'الإسراء ١٧:٢٤', status: 'verified', concepts: ['birr', 'dua'] },
  { id: 'h-031', type: 'hadith', ar: 'جاء رجلٌ إلى رسول الله ﷺ فقال: يا رسول الله، من أحقُّ الناسِ بحُسنِ صحابتي؟ قال: «أمُّك» قال: ثم من؟ قال: «ثم أمُّك» قال: ثم من؟ قال: «ثم أمُّك» قال: ثم من؟ قال: «ثم أبوك»', tr: { en: 'A man came to the Messenger of Allah ﷺ and said: “Who among people is most deserving of my good companionship?” He said: “Your mother.” He asked: “Then who?” He said: “Then your mother.” He asked: “Then who?” He said: “Then your mother.” He asked: “Then who?” He said: “Then your father.”', id: 'Seorang laki-laki datang kepada Rasulullah ﷺ dan bertanya: “Siapakah yang paling berhak aku pergauli dengan baik?” Beliau menjawab: “Ibumu.” Ia bertanya: “Kemudian siapa?” Beliau menjawab: “Kemudian ibumu.” Ia bertanya: “Kemudian siapa?” Beliau menjawab: “Kemudian ibumu.” Ia bertanya: “Kemudian siapa?” Beliau menjawab: “Kemudian ayahmu.”' }, source: 'bukhari', ref: '5971', alsoIn: 'مسلم ٢٥٤٨', narrator: abuHurayrah, grade: sahih, status: 'verified', concepts: ['birr'] },
  { id: 'h-032', type: 'hadith', ar: '«رضا الربِّ في رضا الوالد، وسخطُ الربِّ في سخطِ الوالد»', tr: { en: '“The Lord’s pleasure lies in the parent’s pleasure, and the Lord’s displeasure lies in the parent’s displeasure.”', id: '“Ridha Rabb terletak pada ridha orang tua, dan murka Rabb terletak pada murka orang tua.”' }, source: 'tirmidhi', ref: '1899', narrator: ibnAmr, grade: hasan, status: 'verified', concepts: ['birr'] },
  { id: 'h-033', type: 'hadith', ar: '«من أحبَّ أن يُبسَطَ له في رزقه، ويُنسَأَ له في أثره، فليصلْ رحمَه»', tr: { en: '“Whoever would like his provision to be expanded and his life to be prolonged, let him maintain the ties of kinship.”', id: '“Barang siapa ingin dilapangkan rezekinya dan dipanjangkan umurnya, hendaklah ia menyambung tali silaturahmi.”' }, source: 'bukhari', ref: '5986', alsoIn: 'مسلم ٢٥٥٧', narrator: anas, grade: sahih, status: 'verified', concepts: ['rahim'] },
  { id: 'h-034', type: 'hadith', ar: '«لا يدخلُ الجنةَ قاطع»', tr: { en: '“The one who severs (the ties of kinship) will not enter Paradise.”', id: '“Tidak akan masuk surga orang yang memutus (tali silaturahmi).”' }, source: 'bukhari', ref: '5984', alsoIn: 'مسلم ٢٥٥٦', narrator: n('جبير بن مطعم رضي الله عنه', 'Jubayr ibn Mut‘im (ra)', 'Jubair bin Muth‘im ra'), grade: sahih, status: 'verified', concepts: ['rahim'] },
  { id: 'h-035', type: 'hadith', ar: '«ليس الواصلُ بالمكافئ، ولكنِ الواصلُ الذي إذا قُطعتْ رحمُه وصلَها»', tr: { en: '“The one who maintains ties is not the one who merely reciprocates; rather, it is the one who, when his kin cut him off, keeps the ties.”', id: '“Penyambung silaturahmi bukanlah orang yang sekadar membalas, tetapi orang yang ketika kerabatnya memutus hubungan, ia menyambungnya.”' }, source: 'bukhari', ref: '5991', narrator: ibnAmr, grade: sahih, status: 'verified', concepts: ['rahim'] },
  { id: 'q-019', type: 'ayah', ar: '﴿وَاتَّقُوا اللَّهَ الَّذِي تَسَاءَلُونَ بِهِ وَالْأَرْحَامَ ۚ إِنَّ اللَّهَ كَانَ عَلَيْكُمْ رَقِيبًا﴾', tr: { en: '“And fear Allah, through whom you ask one another, and (respect) the ties of kinship. Indeed, Allah is ever watchful over you.”', id: '“Dan bertakwalah kepada Allah yang dengan nama-Nya kamu saling meminta, dan (peliharalah) hubungan kekeluargaan. Sesungguhnya Allah selalu menjaga dan mengawasimu.”' }, source: 'quran', ref: 'النساء ٤:١', status: 'verified', concepts: ['rahim', 'taqwa'] },
  { id: 'q-020', type: 'ayah', ar: '﴿يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ﴾', tr: { en: '“O you who believe, seek help through patience and prayer. Indeed, Allah is with the patient.”', id: '“Wahai orang-orang yang beriman, mohonlah pertolongan dengan sabar dan shalat. Sesungguhnya Allah beserta orang-orang yang sabar.”' }, source: 'quran', ref: 'البقرة ٢:١٥٣', status: 'verified', concepts: ['sabr', 'arkan'] },
  { id: 'h-036', type: 'hadith', ar: '«وما أُعطيَ أحدٌ عطاءً خيرًا وأوسعَ من الصبر»', tr: { en: '“No one has been given a gift better and more expansive than patience.”', id: '“Tidaklah seseorang diberi pemberian yang lebih baik dan lebih luas daripada kesabaran.”' }, source: 'bukhari', ref: '1469', alsoIn: 'مسلم ١٠٥٣', narrator: n('أبو سعيد الخدري رضي الله عنه', 'Abu Sa‘id al-Khudri (ra)', 'Abu Sa‘id al-Khudri ra'), grade: sahih, status: 'verified', concepts: ['sabr'] },
  { id: 'q-021', type: 'ayah', ar: '﴿وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ﴾', tr: { en: '“And when My servants ask you about Me — indeed I am near. I respond to the call of the caller when he calls upon Me.”', id: '“Dan apabila hamba-hamba-Ku bertanya kepadamu tentang Aku, maka sesungguhnya Aku dekat. Aku mengabulkan permohonan orang yang berdoa apabila ia berdoa kepada-Ku.”' }, source: 'quran', ref: 'البقرة ٢:١٨٦', status: 'verified', concepts: ['dua'] },
  { id: 'h-037', type: 'hadith', ar: '«الدعاءُ هو العبادة»', tr: { en: '“Supplication is worship.”', id: '“Doa adalah ibadah.”' }, source: 'tirmidhi', ref: '2969', alsoIn: 'أبو داود ١٤٧٩', narrator: n('النعمان بن بشير رضي الله عنهما', 'al-Nu‘man ibn Bashir (ra)', 'An-Nu‘man bin Basyir ra'), grade: hasanSahih, status: 'verified', concepts: ['dua'] },
  { id: 'h-038', type: 'hadith', ar: '«ما زال جبريلُ يوصيني بالجار حتى ظننتُ أنه سيُورِّثُه»', tr: { en: '“Jibril kept advising me about the neighbour until I thought he would make him an heir.”', id: '“Jibril terus-menerus berwasiat kepadaku tentang tetangga hingga aku mengira ia akan menjadikannya ahli waris.”' }, source: 'bukhari', ref: '6014', alsoIn: 'مسلم ٢٦٢٤', narrator: n('عائشة رضي الله عنها', '‘A’ishah (ra)', 'Aisyah ra'), grade: sahih, status: 'verified', concepts: ['jar'] },
  { id: 'h-039', type: 'hadith', ar: '«عليكم بالصدق، فإن الصدقَ يهدي إلى البر، وإن البرَّ يهدي إلى الجنة»', tr: { en: '“Hold to truthfulness, for truthfulness leads to righteousness, and righteousness leads to Paradise.”', id: '“Hendaklah kalian berlaku jujur, karena kejujuran menuntun kepada kebaikan, dan kebaikan menuntun ke surga.”' }, source: 'muslim', ref: '2607', narrator: n('عبد الله بن مسعود رضي الله عنه', '‘Abdullah ibn Mas‘ud (ra)', 'Abdullah bin Mas‘ud ra'), grade: sahih, status: 'verified', concepts: ['sidq', 'lisan'] },
  { id: 'q-022', type: 'ayah', ar: '﴿قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا﴾', tr: { en: '“Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.”', id: '“Katakanlah: Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri, janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya.”' }, source: 'quran', ref: 'الزمر ٣٩:٥٣', status: 'verified', concepts: ['tawbah', 'rahmah'] },
  { id: 'q-023', type: 'ayah', ar: '﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾', tr: { en: '“Unquestionably, by the remembrance of Allah hearts are assured.”', id: '“Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.”' }, source: 'quran', ref: 'الرعد ١٣:٢٨', status: 'verified', concepts: ['dhikr'] },
  { id: 'h-040', type: 'hadith', ar: '«كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن: سبحان الله وبحمده، سبحان الله العظيم»', tr: { en: '“Two words are light on the tongue, heavy on the Scale, and beloved to the Most Merciful: Subhan Allahi wa bihamdihi, Subhan Allahil-‘Azim.”', id: '“Dua kalimat yang ringan di lisan, berat di timbangan, dan dicintai oleh Ar-Rahman: Subhanallahi wa bihamdihi, Subhanallahil ‘azhim.”' }, source: 'bukhari', ref: '6406', alsoIn: 'مسلم ٢٦٩٤', narrator: abuHurayrah, grade: sahih, status: 'verified', concepts: ['dhikr'] },
  { id: 'h-041', type: 'hadith', ar: '«وأنا وكافلُ اليتيمِ في الجنة هكذا» وأشار بالسبابة والوسطى، وفرَّج بينهما شيئًا', tr: { en: '“I and the one who looks after an orphan will be in Paradise like this,” and he gestured with his index and middle fingers, slightly apart.', id: '“Aku dan orang yang menanggung anak yatim di surga seperti ini,” dan beliau berisyarat dengan jari telunjuk dan jari tengah, serta sedikit merenggangkan keduanya.' }, source: 'bukhari', ref: '5304', narrator: n('سهل بن سعد رضي الله عنه', 'Sahl ibn Sa‘d (ra)', 'Sahl bin Sa‘ad ra'), grade: sahih, status: 'verified', concepts: ['yatim', 'rahmah'] },
]

export const sourceById = (id: string) => sources.find((s) => s.id === id)
export const conceptById = (id: string) => concepts.find((c) => c.id === id)

export const stats = { items: 128450, sources: 412, concepts: 4380, reviewers: 86 }

// ---------- Review queue ----------
export type ReviewTask = {
  id: string
  kind: 'concept' | 'relation' | 'grade' | 'narrator'
  itemId: string
  proposal: L
  confidence: number
}

export const reviewQueue: ReviewTask[] = [
  { id: 'r-1', kind: 'grade', itemId: 'h-028', proposal: n('الدرجة المقترحة: صحيح (صحّحه الألباني في الصحيحة ٤٥)', 'Proposed grade: sahih (al-Albani, al-Sahihah 45)', 'Derajat usulan: sahih (al-Albani, ash-Shahihah 45)'), confidence: 0.82 },
  { id: 'r-2', kind: 'concept', itemId: 'h-021', proposal: n('ربط المفهوم: «الرحمة والرفق» ← «الأخوة»', 'Link concept: “Mercy & gentleness” → “Brotherhood”', 'Tautkan konsep: “Rahmat” → “Persaudaraan”'), confidence: 0.74 },
  { id: 'r-3', kind: 'narrator', itemId: 'h-029', proposal: n('الراوي الأعلى: أبو هريرة رضي الله عنه', 'Top narrator: Abu Hurayrah (ra)', 'Perawi teratas: Abu Hurairah ra'), confidence: 0.96 },
  { id: 'r-4', kind: 'relation', itemId: 'h-011', proposal: n('علاقة: «يفسّر» ← الآية طه ١١٤', 'Relation: “explains” → Ta-Ha 20:114', 'Relasi: “menjelaskan” → Thaha 20:114'), confidence: 0.61 },
  { id: 'r-5', kind: 'grade', itemId: 'a-003', proposal: n('نسبة القول: مشهور عن الإمام مالك، يُتحقق من الإسناد', 'Attribution: well-known from Imam Malik; isnad to be checked', 'Atribusi: masyhur dari Imam Malik; sanad perlu diperiksa'), confidence: 0.58 },
  { id: 'r-6', kind: 'concept', itemId: 'q-016', proposal: n('مفهوم إضافي: «الخشية»', 'Additional concept: “Reverent fear (khashyah)”', 'Konsep tambahan: “Khasyyah (rasa takut)”'), confidence: 0.88 },
]

// ---------- "Semantic" search stub ----------
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ً-ْٰـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')

const stop = new Set([
  'ما', 'من', 'عن', 'في', 'هل', 'كيف', 'اتعامل', 'مع', 'على', 'الى', 'الي', 'ان', 'او', 'ثم', 'كل', 'لا', 'لي', 'يا', 'هو', 'هي', 'هذا', 'هذه', 'ماذا', 'لماذا', 'متى', 'اين', 'اريد', 'عندي', 'فضل', 'حكم', 'احاديث', 'حديث', 'ايات', 'ايه', 'اية', 'بر', 'و',
  'the', 'what', 'how', 'should', 'deal', 'with', 'about', 'are', 'and', 'is', 'of', 'to', 'in', 'my', 'me', 'do', 'am', 'an', 'or', 'a', 'i', 'for', 'on', 'does', 'can', 'why', 'when', 'who', 'which', 'tell', 'virtue', 'hadith', 'hadiths', 'verses', 'verse',
  'apa', 'saja', 'bagaimana', 'tentang', 'dan', 'hadis', 'menghadapi', 'yang', 'itu', 'ini', 'di', 'ke', 'keutamaan', 'ayat',
])

const tokens = (q: string) =>
  normalize(q)
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stop.has(w))
    .map((w) => (w.startsWith('ال') && w.length > 4 ? w.slice(2) : w))

// Arabic words carry attached particles (و، ف، ب، ك، ل، ال); compare a word's bare forms, not raw substrings,
// so that e.g. «رحم» (kinship) does not match «الرحمن» and «صدق» (truth) does not match «صدقة» (charity).
const forms = (w: string) => {
  const out = new Set([w])
  for (const p of ['وال', 'فال', 'بال', 'كال', 'لل', 'ال', 'و', 'ف', 'ب', 'ل', 'ك']) if (w.startsWith(p) && w.length - p.length >= 2) out.add(w.slice(p.length))
  return out
}
const wordMatch = (word: string, tok: string) => {
  for (const f of forms(word)) {
    if (f === tok) return true
    // light stemming: allow short suffixes (plurals, pronouns, English -s/-ful/-ing) on longer tokens
    if (tok.length >= 4 && f.startsWith(tok) && f.length - tok.length <= 3) return true
  }
  return false
}
const phraseMatch = (hay: string[], phrase: string) => {
  const ws = normalize(phrase).split(/\s+/).filter(Boolean)
  if (ws.length === 1) return hay.some((w) => wordMatch(w, ws[0]))
  return hay.join(' ').includes(ws.join(' '))
}

const conceptMatches = (tok: string) => concepts.filter((c) => [...c.synonyms, ...Object.values(c.label)].some((s) => phraseMatch([tok], s) || phraseMatch(normalize(s).split(/\s+/), tok)))

export function searchItems(query: string): { item: Item; score: number }[] {
  const toks = tokens(query)
  if (!toks.length) return normalize(query).trim() ? [] : items.map((item) => ({ item, score: 0 }))
  return items
    .map((item) => {
      const hay = normalize([item.ar, item.tr.en, item.tr.id].join(' ')).split(/\s+/).filter(Boolean)
      let direct = 0
      let related = 0
      for (const tok of toks) {
        if (hay.some((w) => wordMatch(w, tok))) direct += 3
        for (const c of conceptMatches(tok)) {
          if (item.concepts.includes(c.id)) direct += 2
          else if (item.concepts.some((ic) => c.related.includes(ic))) related += 0.5
        }
      }
      // Related concepts only re-rank; they never pull in a text that does not match the question itself.
      let score = direct ? direct + related : 0
      if (item.status === 'verified') score *= 1.1
      return { item, score }
    })
    .filter((r) => r.score >= 2)
    .sort((a, b) => b.score - a.score)
}

export const exampleQueries: L[] = [
  n('الغضب', 'anger', 'marah'),
  n('طلب العلم', 'seeking knowledge', 'menuntut ilmu'),
  n('الرحمة', 'mercy', 'rahmat'),
  n('التثبت من الأخبار', 'verify news', 'tabayyun berita'),
  n('الصدقة', 'charity', 'sedekah'),
  n('بر الوالدين', 'honouring parents', 'berbakti orang tua'),
  n('صلة الرحم', 'ties of kinship', 'silaturahmi'),
  n('الصبر', 'patience', 'sabar'),
]
