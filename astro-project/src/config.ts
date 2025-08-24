// Here are stored the params of the site

// TODO: install i18n
export const siteConfig = {
  title: "Eirb'Academy",
  footer: {
    issue: "Un problème avec cette page ?",
    issue_url_content: "Corrigez-la sur Github",
    contact: "Besoin d'aide ? Contactez",
    contact_email: "eirbware[at]enseirb-matmeca.fr",
    copyright: "Eirbware",
    links_title: "Sections du site"
  },
  links: {
    github_content: "https://github.com/Eirbware/opeirb-classroom/tree/master/",
    helpful: {
      github: "https://github.com/Eirbware",
      telegram: "https://t.me/eirbware",
      facebook: "https://www.facebook.com/eirbware",
      linkedin: "https://www.linkedin.com/company/eirbware/",
    }
  }
}

// TODO:
export const siteMenu: Record<"footer" | "main", {name?: string, url: string}[]> = {
  main: [
    { name: 'Cours', url: '/courses/' },
    { name: 'Tips', url: '/tips/' }
  ],
  footer: [
    { name: 'Cours', url: '/courses/' },
    { name: 'Tips', url: '/tips/' }
  ]
}
