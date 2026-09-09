import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Soru metni gereklidir." }, { status: 400 });
    }

    const q = prompt.toLowerCase();

    let diagnosis = "";
    let solutions: string[] = [];
    let recommendedCategory = "";
    let productKeyword = "";

    if (q.includes("takla") || q.includes("yokuş") || q.includes("devril") || q.includes("ağırlık") || q.includes("dik")) {
      diagnosis = "Yüksek Eğimde Arkaya Devrilme ve Yan Eğim Tutunma Zafiyeti (Yüksek Ağırlık Merkezi - CoG Hatası)";
      solutions = [
        "Ön aks tekerlek göbeklerine ağır pirinç (brass) portal kapakları takarak ağırlık merkezini zemin seviyesine çekin.",
        "Ağırlık dağılımını %60 Ön / %40 Arka oranına kalibre edin.",
        "Batarya yuvasını şasinin en alt orta pozisyonuna indirin veya küçük boyutlu 3S LiPo paketine geçin.",
      ];
      recommendedCategory = "pirinc-ve-metal-aksam";
      productKeyword = "Pirinç";
    } else if (q.includes("servo") || q.includes("direksiyon") || q.includes("titre") || q.includes("dönmüyor") || q.includes("güçsüz")) {
      diagnosis = "Direksiyon Servosu Tork Yetersizliği ve BEC Aşırı Yüklenmesi (Kaya Sıkışması Hatası)";
      solutions = [
        "Kaya arasında lastikler kilitlendiğinde plastik dişliler sıyırır; en az 45kg-50kg torklu paslanmaz çelik dişli su geçirmez servoya geçin.",
        "ESC dahili BEC devresi yetersiz kalıyorsa alıcıya doğrudan 7.4V / 8.4V harici BEC devresi bağlayın.",
        "Alüminyum CNC servo kolu kullanarak esnemeyi sıfırlayın.",
      ];
      recommendedCategory = "elektronik-motor-servo";
      productKeyword = "Servo";
    } else if (q.includes("ısın") || q.includes("motor") || q.includes("esc") || q.includes("tekle") || q.includes("gaz")) {
      diagnosis = "Düşük Hız Tork Yetersizliği ve Fırçalı Motor Aşırı Isınması (COGging & Termal Kesme)";
      solutions = [
        "Klasik fırçalı motorlar yavaş tırmanışta yüksek akım çekerek yanar; FOC Sensörlü Fırçasız (Brushless) güç ünitesine geçin.",
        "Pinyon dişlisini 1-2 diş küçülterek motor üzerindeki mekanik yükü hafifletin.",
        "Aşırı ısınmayı önlemek için Field-Oriented Control (FOC) Akıllı Yokuş Freni destekli ESC kullanın.",
      ];
      recommendedCategory = "elektronik-motor-servo";
      productKeyword = "Fırçasız";
    } else if (q.includes("lastik") || q.includes("tutun") || q.includes("kayı") || q.includes("jant") || q.includes("çamur")) {
      diagnosis = "Kaygan Yüzeyde Zemin Tutunma (Traction) Kaybı ve Yanak Esnemesi";
      solutions = [
        "Yapışkan süper yumuşak hamurlu (Sticky Compound) derin dişli kaya tırmanma lastiklerine geçin.",
        "Vidalı Beadlock alüminyum jantlar kullanarak lastiğin janttan çıkmasını engelleyin ve alt ağırlık kazanın.",
        "Dual-Stage (Çift kademeli) sünger kullanarak dik yan eğimlerde lastik yanağının katlanmasını önleyin.",
      ];
      recommendedCategory = "jant-ve-lastik";
      productKeyword = "Lastik";
    } else if (q.includes("tork bükül") || q.includes("torque twist") || q.includes("şaft") || q.includes("dişli sıyır")) {
      diagnosis = "Tork Bükülmesi (Torque Twist) ve Plastik Şaft Deformasyonu";
      solutions = [
        "Ön aksa %15 - %25 portal overdrive dişli kiti takarak ön tekerleklerin aracı çekmesini sağlayın.",
        "Plastik merkez şaftları sertleştirilmiş teleskopik çelik şaftlarla değiştirin.",
        "Sağ arka amortisör yay sertliğini (preload) hafifçe artırarak şasi burulmasını dengeleyin.",
      ];
      recommendedCategory = "pirinc-ve-metal-aksam";
      productKeyword = "Şaft";
    } else {
      diagnosis = "Genel RC Crawler Şasi & Performans Optimizasyon Analizi";
      solutions = [
        "Aracınızın markasına göre (TRX-4, SCX10, Capra) portal aks ve pirinç yükseltmeleri yapın.",
        "Ağırlık merkezini CoG simülatörümüz ile test ederek %60 ön ağırlığa sabitleyin.",
        "Detaylı parça ve kurulum desteği için WhatsApp teknik danışmanımızla görüşün.",
      ];
      recommendedCategory = "rc-crawler-araclar";
      productKeyword = "Crawler";
    }

    // İlgili ürünleri getir
    const matchingProducts = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: productKeyword } },
          { description: { contains: productKeyword } },
        ],
      },
      take: 2,
      select: {
        id: true,
        title: true,
        slug: true,
        basePrice: true,
        images: true,
      },
    });

    return NextResponse.json({
      success: true,
      diagnosis,
      solutions,
      matchingProducts,
    });
  } catch (error) {
    console.error("Error in AI Doctor:", error);
    return NextResponse.json({ success: false, error: "Teşhis yapılamadı" }, { status: 500 });
  }
}
