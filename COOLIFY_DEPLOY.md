# Coolify Deploy Kurulumu

## GitHub Repo
- **URL:** https://github.com/zuhayr635/cihanekspress
- **Branch:** master
- **Private:** ✅

## Coolify Uygulama Bilgileri

### Mevcut Uygulama
- **Application UUID:** `kou4l6t39m50cqrfkwpuntkg`
- **FQDN:** cihanekspress.com
- **Server:** nice-newt-hqntx8dvpp59gb84n1czgg9x (panelc.cihanekspress.com)
- **Build Pack:** dockerfile
- **Port:** 3000

### Environment Variables (Coolify'da zaten ayarlı)
```
DATABASE_URL=mysql://mysql:eYfRoiMbFzrfDWS8lahER0qcPUUo9pLaCEdBHhpDGNmizN5j3GLztjqdSILFCVfy@c9shg98szvk1qrteuoeqwbea:3306/default
NEXTAUTH_SECRET=7d2c6c42d068b20115b6d807e4cebf86
NEXTAUTH_URL=https://cihanekspress.com
NEXT_PUBLIC_BASE_URL=https://cihanekspress.com
IMGBB_API_KEY=83814b27776188404484c82bd8ffd884
WHATSAPP_NUMBER=+905304784944
```

### MySQL Database
- **UUID:** c9shg98szvk1qrteuoeqwbea
- **Database:** default
- **User:** mysql
- **Internal URL:** `mysql://mysql:eYfRoiMbFzrfDWS8lahER0qcPUUo9pLaCEdBHhpDGNmizN5j3GLztjqdSILFCVfy@c9shg98szvk1qrteuoeqwbea:3306/default`

## Deploy Adımları

### Seçenek 1: Coolify Panel (Manuel)
1. Coolify paneline git: http://78.129.240.5:8000
2. Cihanekspress projesi → Cihanekspress uygulaması
3. Git ayarlarını güncelle:
   - Repository: `zuhayr635/cihanekspress`
   - Branch: `master`
4. "Deploy" butonuna tıkla

### Seçenek 2: API ile Güncelleme (Otomatik)
```bash
curl -X PATCH "http://78.129.240.5:8000/api/v1/applications/kou4l6t39m50cqrfkwpuntkg" \
  -H "Authorization: Bearer 5|2ad8Xx6dVH4DRP8BhnUxNf8aU25TPvyg60C4wVPqb4221927" \
  -H "Content-Type: application/json" \
  -d '{
    "git_repository": "zuhayr635/cihanekspress",
    "git_branch": "master"
  }'
```

### GitHub Actions Webhook
GitHub'da manual webhook secret oluştur:
1. https://github.com/zuhayr635/cihanekspress/settings/secrets/actions
2. New repository secret:
   - Name: `COOLIFY_WEBHOOK_URL`
   - Value: Coolify panelinden webhook URL al (deploy sekmesinde)
   - Name: `COOLIFY_WEBHOOK_TOKEN`
   - Value: Webhook token

Sonra push yapınca otomatik deploy tetiklenecek.
