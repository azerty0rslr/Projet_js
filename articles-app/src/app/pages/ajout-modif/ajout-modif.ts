import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArticleService, Article } from '../../services/article';

@Component({
  selector: 'app-ajout-modif',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ajout-modif.html',
  styleUrl: './ajout-modif.scss'
})
export class AjoutModif {
  articleId: string | null = null;
  article: Article = { id: '', title: '', desc: '', author: '', imgPath: '' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) {}

  ngOnInit() {
    // Récupère l'id de l'article pour modification
    this.articleId = this.route.snapshot.paramMap.get('id');
    if (this.articleId) {
      this.articleService.getById(this.articleId).subscribe({
        next: (res: any) => {
          // Backend peut renvoyer {data: article} ou directement article
          if (res?.data) {
            this.article = res.data;
          } else {
            this.article = res;
          }
        },
        error: (err) => console.error('Erreur de chargement de l’article', err)
      });
    }
  }

  // Soumission du formulaire
  sendFormData() {
    const action$ = this.articleId
      ? this.articleService.save(this.article) // modification
      : this.articleService.save(this.article); // création

    action$.subscribe({
      next: (res) => {
        alert('Article enregistré avec succès !');
        this.router.navigate(['/liste-articles']);
      },
      error: (err) => console.error('Erreur de sauvegarde de l’article', err)
    });
  }
}
