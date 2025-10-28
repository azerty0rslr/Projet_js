# 1 - Mise en place du projet
## A) Clôner l'API
A la racine du projet on clone l'API pour le back, puis on le lance :  
```cmd
git clone https://github.com/Chocolaterie/ApiArticle.git
cd ApiArticle
npm install
npm start
```
  
## B) Créer nouveau projet pour le front
A la racine du projet, créer le projet pour le front et le lancer :  
<img width="1509" height="780" alt="image" src="https://github.com/user-attachments/assets/87321f44-5f7c-4518-a811-efdb922b5b25"/>  
```cmd
cd articles-app
ng serve
```
Le front sera accessible sur http://localhost:4200.  
    
## C) Création de l'arborescence 
On crée les composants du front dans le terminal. L’arborescence sera la suivante :  
- src/app/
  - pages/
    - connexion
    - ajout_modif
    - inscription
    - mdp
    - detail-article
    - liste-articles
    - creation
  - services/
    - article
  
```cmd
ng generate component pages/connexion
ng generate component pages/ajout_modif
ng generate component pages/inscription
ng generate component pages/mdp
ng generate component pages/detail-article
ng generate component pages/liste-articles
ng generate component pages/creation
```
  
<img width="971" height="623" alt="image" src="https://github.com/user-attachments/assets/90dac48a-1d98-4166-b03b-106f1d8fd157"/>  

## D) Lier les routes 
Dans articles-app/src/app/app.routes.ts je lie toutes les pages créées de la manière suivante :  
```ts
import { Routes } from '@angular/router';
import {Connexion} from './pages/connexion/connexion';
import {AjoutModif} from './pages/ajout-modif/ajout-modif';
import {Inscription} from './pages/inscription/inscription';
import {Mdp} from './pages/mdp/mdp';
import {ListeArticles} from './pages/liste-articles/liste-articles';
import {DetailArticle} from './pages/detail-article/detail-article';
import {Creation} from './pages/creation/creation';

export const routes: Routes = [
  {path: 'connexion', component: Connexion},
  {path: 'inscription', component: Inscription},
  {path: 'password', component: Mdp},
  {path: 'ajout-modif/:id', component: AjoutModif},
  {path: 'liste-articles', component: ListeArticles},
  {path: 'detail-article/:id', component: DetailArticle},
  {path: 'creation', component: Creation}
];
```
  
Les component se trouvent dans le fichier .ts de la page en question juste après le export class.  


# 2 - Mise en place des fonctionnalitées de base
## A) Création du service
Le service permet de centraliser toutes les interactions avec le backend, il s'occupe des appels à l'API.  
On créer le service avec la commande suivante dans le terminal :  
```cmd
ng generate service services/article
```

Puis on créer la structure de l'article dans le fichier articles-app/src/app/services/article.ts, en reprenant les composants d'un article (voir dans le back dans ApiArticle/articles/articles-routes.js) :
```ts
export interface Article {
  id: string;
  title: string;
  desc: string;
  author: string;
  imgPath: string;
}
```

On fait le lien avec le back et la méthode HTTP :  
```ts
@Injectable({ providedIn: 'root' })
export class ArticleService {
  private apiUrl = 'http://localhost:3000/articles';

  constructor(private http: HttpClient) {}
```

Dans le service, on définit les méthodes pour communiquer avec le back :  
```ts
  getAll(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  getById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  save(article: Article): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save`, article);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
```  

## B) Liste des articles
On part sur la base suivante pour la page de listage des articles.  
HTML : affichage des articles et des boutons d’action.  
```html
<div *ngIf="connected" class="uk-alert-success uk-text-center uk-padding-small" uk-alert>
  <p><strong>Vous êtes connecté</strong></p>
</div>

<div class="uk-container" uk-height-viewport="offset-bottom: 40">
  <button class="uk-button uk-button-primary uk-width-1-1" (click)="connexion()">Connexion</button>
  <button class="uk-button uk-button-primary uk-width-1-1" (click)="inscription()">Inscription</button>
  <button class="uk-button uk-button-primary uk-width-1-1" (click)="creation()">+</button>

  <h2><b>Articles</b></h2>
  <div class="uk-margin"></div>

  <div class="uk-child-width-1-2@s uk-grid-match" uk-grid>
    <div *ngFor="let article of DB_Articles">
      <div>
        <button class="uk-button uk-button-primary uk-width-1-1" (click)="modifier(article.id)">Modifier</button>
        <button class="uk-button uk-button-primary uk-width-1-1" (click)="supprimer(article.id)">Supprimer</button>
        <div class="uk-card uk-card-secondary uk-card-hover uk-card-body sdv-movie-card"
             [ngStyle]="{ 'background-image': 'url(' + article.imgPath + ')' }">
          <div class="uk-card uk-card-default uk-card-hover uk-card-body">
            <h3 class="uk-card-title"><font color="black">{{ article.title }}</font></h3>
            <p><font color="black">
              Auteur : {{ article.author }} <br>
              Description : {{ article.desc }}
            </font></p>
          </div>
          <button class="uk-button uk-button-primary uk-width-1-1" (click)="detail(article.id)">Voir plus</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

TS : liaison avec le backend, suppression, navigation.  
```ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { ArticleService, Article } from '../../services/article';

@Component({
  selector: 'app-liste-articles',
  standalone: true,
  imports: [NgFor, NgIf, NgStyle],
  templateUrl: './liste-articles.html',
  styleUrl: './liste-articles.scss'
})
export class ListeArticles {
  public connected = false;
  public DB_Articles: Article[] = [];

  constructor(
    private router: Router,
    private articleService: ArticleService
  ) {}

  ngOnInit() {
    // Vérifie la connexion (message vert)
    if (localStorage.getItem('connected') === 'true') {
      this.connected = true;
      setTimeout(() => {
        this.connected = false;
        localStorage.removeItem('connected');
      }, 3000);
    }

    this.loadArticles();
  }

  // Charger la liste des articles
  loadArticles() {
    this.articleService.getAll().subscribe({
      next: (res: any) => {
        // back renvoie { data: [...] }
        if (res && res.data && Array.isArray(res.data)) {
          this.DB_Articles = res.data;
        }
        // back renvoie un tableau
        else if (Array.isArray(res)) {
          this.DB_Articles = res;
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des articles :');
        this.DB_Articles = [];
      }
    });
  }

  // Actions des boutons

  modifier(articleId: string) {
    this.router.navigate(['/ajout-modif', articleId]);
  }

// Suppression d'un article
  supprimer(articleId: string) {
    if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
      this.articleService.delete(articleId).subscribe({
        next: () => {
          alert('Article supprimé avec succès !');
          this.loadArticles(); // recharge la liste
        },
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }

  detail(articleId: string) {
    this.router.navigate(['/detail-article', articleId]);
  }

  creation() {
    this.router.navigate(['/creation']);
  }

  connexion() {
    this.router.navigate(['/connexion']);
  }

  inscription() {
    this.router.navigate(['/inscription']);
  }
}
```
  
## C) Détail article
Page affichant un article précis à partir de son id dans l’URL.  
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width"/>
  <title>Articles</title>
</head>
<body>

<div class="uk-container" uk-height-viewport="offset-bottom: 40">
  <div class="uk-margin"></div>
  <h2><b>{{ article.title }}</b></h2>

  <div class="uk-card uk-card-secondary uk-card-hover uk-card-body sdv-movie-card"
       [ngStyle]="{ 'background-image': 'url(' + article.imgPath + ')' }">

    <div class="uk-card uk-card-default uk-card-hover uk-card-body">
      <p>
        <FONT COLOR="black">
          Auteur : {{ article.author }} <br>
          {{ article.desc }}
        </FONT>
      </p>
    </div>
  </div>
</div>

</body>
</html>
```

Les articles sont récupérés dans DB_Articles pour le moment.  
Le TS utilise ActivatedRoute pour récupérer l’id dans l’URL.  
```ts
import { Component } from '@angular/core';
import {NgStyle} from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-article',
  imports: [NgStyle],
  templateUrl: './detail-article.html',
  styleUrls: ['./detail-article.scss']
})

export class DetailArticle {
  articleId: string | null = null;
  article: any = null; // ou Article si tu utilises l'interface

  public DB_Articles = [
    { id: '1', title: 'Premier article', desc: 'Contenu du premier article', author: 'Isaac', imgPath: 'https://dogtime.com/wp-content/uploads/sites/12/2011/01/GettyImages-653001154-e1691965000531.jpg' },
    { id: '2', title: 'Deuxième article', desc: 'Contenu du deuxième article', author: 'Sanchez', imgPath: 'https://dogtime.com/wp-content/uploads/sites/12/2011/01/GettyImages-653001154-e1691965000531.jpg' },
    { id: '3', title: 'Troisième article', desc: 'Contenu du troisième article', author: 'Toto', imgPath: 'https://dogtime.com/wp-content/uploads/sites/12/2011/01/GettyImages-653001154-e1691965000531.jpg' }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // On récupère l'id passé dans l'URL
    this.articleId = this.route.snapshot.paramMap.get('id');

    // On cherche l'article correspondant dans DB_Articles
    if (this.articleId) {
      this.article = this.DB_Articles.find(a => a.id === this.articleId);
    }
  }
}
```

# 3- Création des formulaires 
## A) Ajout et modification d'un article
### Ajout
Formulaire lié à ngModel pour récupérer les valeurs.  
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width"/>
  <title>Articles</title>
</head>
<body>
<div class="uk-container">
  <h2>Créer un article</h2>
  <hr>
  <div class="uk-margin">
    <input class="uk-input" [(ngModel)]="article.id" type="text" placeholder="ID"/>
  </div> <div class="uk-margin">
  <input class="uk-input" [(ngModel)]="article.title" type="text" placeholder="Titre de l'article"/>
</div>
  <div class="uk-margin">
    <input class="uk-input" [(ngModel)]="article.desc" type="text" placeholder="Description"/>
  </div>
  <div class="uk-margin">
    <input class="uk-input" [(ngModel)]="article.author" type="text" placeholder="Auteur"/>
  </div>
  <button class="uk-button uk-button-primary uk-width-1-1"
          (click)="sendFormData()">Soumettre </button>
</div>
</body>
</html>
```

```ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArticleService, Article } from '../../services/article';

@Component({
  selector: 'app-creation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './creation.html',
  styleUrl: './creation.scss'
})
export class Creation {
  article: Article = { id: '', title: '', desc: '', author: '', imgPath: '' };

  constructor(private router: Router, private articleService: ArticleService) {}

  sendFormData() {
    this.articleService.save(this.article).subscribe({
      next: () => {
        alert('Article créé avec succès !');
        this.router.navigate(['/liste-articles']);
      },
      error: (err) => console.error('Erreur lors de la création de l’article', err)
    });
  }

  annuler() {
    this.router.navigate(['/liste-articles']);
  }
}
```

### Modification
Formulaire pré-rempli avec les informations de l'article qui est en train d'être modifié.  
Création et modification utilisent le même composant, avec pré-remplissage si articleId est défini.  
```html
<div class="uk-container">
  <h2>Modifier un article</h2>
  <hr>

  <div class="uk-margin">
    <input class="uk-input" [(ngModel)]="article.id" type="text" placeholder="ID"/>
  </div>

  <div class="uk-margin">
    <input class="uk-input" [(ngModel)]="article.title" type="text" placeholder="Titre de l'article"/>
  </div>

  <div class="uk-margin">
    <input class="uk-input" [(ngModel)]="article.desc" type="text" placeholder="Description"/>
  </div>

  <div class="uk-margin">
    <input class="uk-input" [(ngModel)]="article.author" type="text" placeholder="Auteur"/>
  </div>

  <button class="uk-button uk-button-primary uk-width-1-1"
          (click)="sendFormData()">Soumettre</button>
</div>
```

```ts
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
    this.articleId = this.route.snapshot.paramMap.get('id');
    if (this.articleId) {
      this.articleService.getById(this.articleId).subscribe({
        next: (res: any) => {
          // Backend peut renvoyer directement l'article ou { data: article }
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

  sendFormData() {
    // Si articleId est défini, c’est une modification
    const action$ = this.articleId
      ? this.articleService.save(this.article) // POST pour création ou PUT selon ton backend
      : this.articleService.save(this.article); // pour création, même endpoint

    action$.subscribe({
      next: (res) => {
        alert('Article enregistré avec succès !');
        this.router.navigate(['/liste-articles']);
      },
      error: (err) => console.error('Erreur de sauvegarde de l’article', err)
    });
  }
}
```

## B) Page de connexion 
Vérifie email et mot de passe.  
Affiche un message de confirmation sur la page liste en utilisant localStorage.setItem('connected', 'true').  
Redirection selon le résultat de la vérification.  
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width"/>
  <title>Articles</title>
</head>
<body>

<div class="uk-container">
  <h2>Connexion</h2>

  <hr>
  <h4>Entrer votre email et votre mots de passe pour vous connecter</h4>

  <div class="uk-margin">
    <input class="uk-input" [(ngModel)]="user.email" type="text" placeholder="Email"/>
  </div>

  <div class="uk-margin">
    <input class="uk-input" [(ngModel)]="user.password" type="password" placeholder="Mots de passe"/>
  </div>

  <button class="uk-button uk-button-primary uk-width-1-1"
          (click)="sendFormData()">Se connecter
  </button>

  <p class="uk-button uk-width-1-1" (click)="mdp()">Mots de passe oublié</p>
</div>

</body>
</html>
```

```ts
import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

// Normalement dans un fichier à part (user.ts)
export class User {
  public email: string = "";
  public password: string = "";
}

@Component({
  selector: 'app-connexion',
  imports: [FormsModule],
  templateUrl: './connexion.html',
  styleUrl: './connexion.scss'
})
export class Connexion {
  public user : User = new User();

  // on injecte Router dans le constructeur
  constructor(private router: Router) {}

  // Vérifie si l'email est au bon format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }

  sendFormData(){
    // Vérification du format de l'email
    if (!this.isValidEmail(this.user.email)) {
      alert("Veuillez entrer une adresse email valide (exemple : nom@domaine.com)");
      return; // on stoppe la fonction ici
    }

    // Vérification du mot de passe vide
    if (!this.user.password.trim()) {
      alert("Le mot de passe ne peut pas être vide");
      return;
    }

    // Stocke l'état de connexion pour l'afficher dans liste-articles
    localStorage.setItem('connected', 'true');

    // Redirection vers la page liste-articles
    this.router.navigate(['/liste-articles']);
  }

  // redirige vers /connexion
  mdp() {
    this.router.navigate(['/password']);
  }
}
```

## C) Page d'inscription
Vérifie la validité de l’email et si les mots de passe correspondent.  
Redirection vers la liste des articles si inscription ok.  
```html
<div class="uk-container">
  <h2>Inscription</h2>

  <hr>
  <h4>Entrer votre email puis confirmez votre mots de passe</h4>

  <!-- Champ email -->
  <div class="uk-margin">
    <input class="uk-input" [(ngModel)]="user.email" type="text" placeholder="Email"/>
  </div>

  <!-- Premier mot de passe -->
  <div class="uk-margin">
    <input class="uk-input" [(ngModel)]="user.password" type="password" placeholder="Mot de passe"/>
  </div>

  <!-- Confirmation du mot de passe -->
  <div class="uk-margin">
    <input class="uk-input" [(ngModel)]="confirmPassword" type="password" placeholder="Confirmer le mot de passe"/>
  </div>

  <button class="uk-button uk-button-primary uk-width-1-1"
          (click)="sendFormData()">S'inscrire
  </button>
</div>
```

```ts
import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';

// Normalement dans un fichier à part (user.ts)
export class User {
  public email: string = "";
  public password: string = "";
}

@Component({
  selector: 'app-inscription',
  imports: [FormsModule],
  templateUrl: './inscription.html',
  styleUrl: './inscription.scss'
})

export class Inscription {
  public user : User = new User();
  public confirmPassword: string = "";

  constructor(private router: Router) {}

  // Vérifie que l'email est valide
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  sendFormData(){
    // Vérification de l'email
    if (!this.isValidEmail(this.user.email)) {
      alert("Veuillez entrer une adresse email valide (exemple : nom@domaine.com)");
      return;
    }

    // Vérification des mots de passe
    if (this.user.password !== this.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    // Stocke l'état de connexion
    localStorage.setItem('connected', 'true');

    // Redirection vers la liste des articles
    this.router.navigate(['/liste-articles']);
  }
}
```

## D) Page mot de passe oublié
Formulaire pour saisir l’email et recevoir un lien de réinitialisation.  
```html
<div class="uk-container">
  <h2>Mots de passe oublié</h2>

  <hr>
  <h4>Entrer votre email afin de recevoir un lien pour changer de mot de passe</h4>

  <div class="uk-margin">
    <input class="uk-input" [(ngModel)]="user.email" type="text" placeholder="Email"/>
  </div>

  <button class="uk-button uk-button-primary uk-width-1-1"
          (click)="sendFormData()">Envoyer le lien
  </button>
</div>
```
```ts
import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

// Normalement dans un fichier à part (user.ts)
export class User {
  public email: string = "";
  public pseudo: string = "";
}

@Component({
  selector: 'app-mdp',
  imports: [FormsModule],
  templateUrl: './mdp.html',
  styleUrl: './mdp.scss'
})
export class Mdp {
  public user : User = new User();

  // on injecte Router dans le constructeur
  constructor(private router: Router) {}

  // Vérifie si l'email est au bon format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }

  sendFormData(){
    // Vérification du format de l'email
    if (!this.isValidEmail(this.user.email)) {
      alert("Veuillez entrer une adresse email valide (exemple : nom@domaine.com)");
      return; // on stoppe la fonction ici
    }

    // Si email bon
    alert("Email de réinitialisation du mots de passe envoyé");
  }
}
```

## E) Ajout du style pour les pages
Je reprends la mise en forme du projet précédent, je reprends le dossier uikit que je mets dans public/uikit.  
Mise en forme appliquée dans index.html et app.html.  
router-outlet injecte le contenu des pages dans le layout principal.  
Header et footer uniformes.    
  
index.html :  
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>TP</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">

  <!-- UIkit CSS -->
  <link rel="stylesheet" href="/uikit/css/uikit.min.css"/>

  <!-- UIkit JS -->
  <script src="/uikit/js/uikit.min.js"></script>
  <script src="/uikit/js/uikit-icons.min.js"></script>

</head>
<body>
  <app-root></app-root>
</body>
</html>
```

app.html :  
```html
<!--HEADER-->
<header class="uk-box-shadow-small uk-section-secondary eni-header">
  <div class="uk-container uk-container-expand">
    <nav class="uk-navbar" id="navbar" data-uk-navbar>
      <div class="uk-navbar-center">
        <a class="uk-navbar-item uk-logo" href="#">App Articles</a>
      </div>
    </nav>
  </div>
</header>
<!--/HEADER-->

<router-outlet />

<!--FOOTER-->
<footer class="uk-section-secondary">
  <div class="uk-container uk-section">
    <div class="uk-grid uk-child-width-1-3@l" data-uk-grid>
      <div>
        <h4>Social Media</h4>
        <a href="" class="uk-icon-button  uk-margin-small-right" data-uk-icon="facebook"></a>
        <a href="" class="uk-icon-button  uk-margin-small-right" data-uk-icon="twitter"></a>
        <a href="" class="uk-icon-button" data-uk-icon="instagram"></a>
      </div>
    </div>
  </div>
  <div class="uk-section uk-section-xsmall" style="background-color: rgba(0,0,0,0.15)">
    <div class="uk-container">
      <div class="uk-grid uk-child-width-1-2@s uk-text-center uk-text-left@s" data-uk-grid>
        <div class="uk-text-small uk-text-muted">
          Copyright 2025 - All rights reserved.
        </div>
      </div>
    </div>
  </div>
</footer>
```

#### Résultats
<img width="1720" height="849" alt="image" src="https://github.com/user-attachments/assets/8d1d1d25-820b-446a-88bf-48a9cf545b3f" />
