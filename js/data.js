/*
  CONTEÚDO DA PÁGINA — edite aqui.

  profile  → nome, apresentação, frases que giram (separe por vírgula), bio, local,
             status, avatar (URL ou caminho, ex.: assets/eu.jpg), email, botão final
  links    → { id, label, url }  (aparecem no topo)
  projects → title, desc, ai (true/false), category ("ia" | "web" | "outro"),
             status ("live" | "beta" | "dev" | "proto" | "pause"), year, stack (vírgula),
             url, repo, image, featured (true = card largo)

  updatedAt → data da última atualização, mostrada no rodapé (formato "AAAA-MM-DDT12:00:00")

  Cada item precisa de um "id" diferente.
*/
window.SITE_DATA = {
  "profile": {
    "name": "André Morais",
    "role": "Desenvolvedor front-end. Transformo problemas do dia a dia em produtos web, juntando inteligência artificial e interfaces bem cuidadas.",
    "rotating": "produtos com IA, apps web completos, interfaces que encantam, ferramentas que resolvem",
    "bio": "Construo do zero, da interface ao banco de dados. Uso IA como matéria-prima: para ler documentos, gerar conteúdo e automatizar o trabalho chato. O resultado são ferramentas que pessoas de verdade usam todos os dias.",
    "location": "Teresina, PI",
    "status": "Aberto a freelas",
    "avatar": "assets/andre-morais-avatar.jpg",
    "email": "",
    "ctaLabel": "Ver meu GitHub",
    "ctaUrl": "https://github.com/andremoraisms"
  },
  "updatedAt": "2026-10-29T12:00:00",
  "links": [
    {
      "id": "l1",
      "label": "GitHub",
      "url": "https://github.com/andremoraisms"
    },
    {
      "id": "l2",
      "label": "StudyFlow",
      "url": "https://studyflow.net.br"
    }
  ],
  "projects": [
    {
      "id": "p1",
      "title": "StudyFlow",
      "desc": "Plataforma de estudos com revisão espaçada, flashcards, cronômetro e gamificação com XP, níveis e conquistas. A IA lê seus PDFs e gera questões de múltipla escolha automaticamente.",
      "ai": true,
      "category": "ia",
      "status": "live",
      "year": "2026",
      "stack": "React, TypeScript, Firebase",
      "url": "https://studyflow.net.br",
      "repo": "",
      "image": "assets/og-studyflow.png",
      "featured": true
    },
    {
      "id": "p2",
      "title": "StorageHub",
      "desc": "Painel que acompanha em tempo real o armazenamento de Google Drive, iCloud, notebook, iPhone e iPad num só lugar.",
      "ai": true,
      "category": "web",
      "status": "live",
      "year": "2026",
      "stack": "React, Firebase",
      "url": "https://storagehub.com.br/",
      "repo": "",
      "image": "assets/cover-storagehub.svg",
      "featured": false
    },
    {
      "id": "p3",
      "title": "Bitstock",
      "desc": "Controle de estoque de TI. Acompanha consumíveis pelo saldo e equipamentos por unidade, registra cada entrada, saída, empréstimo e manutenção, avisa sobre estoque mínimo e empréstimos atrasados e gera relatórios em PDF, Excel e CSV e termos de responsabilidade.",
      "ai": true,
      "category": "web",
      "status": "dev",
      "year": "2026",
      "stack": "JavaScript, Chart.js, jsPDF, SheetJS",
      "url": "",
      "repo": "",
      "image": "assets/cover-bitstock.png",
      "featured": false
    },
    {
      "id": "p4",
      "title": "Gestum",
      "desc": "App de finanças pessoais com entradas, gastos, assinaturas, investimentos e metas num só lugar.",
      "ai": true,
      "category": "web",
      "status": "live",
      "year": "2026",
      "stack": "React, Vite, Firebase",
      "url": "https://gestum-26315.web.app",
      "repo": "",
      "image": "assets/cover-gestum.png",
      "featured": false
    },
    {
      "id": "p5",
      "title": "Clube do Desconto",
      "desc": "Landing page que reúne grupos de promoções no WhatsApp para quem caça desconto.",
      "ai": false,
      "category": "outro",
      "status": "dev",
      "year": "2026",
      "stack": "HTML, CSS, JavaScript, Firebase Hosting",
      "url": "",
      "repo": "",
      "image": "",
      "featured": false
    }
  ]
};
