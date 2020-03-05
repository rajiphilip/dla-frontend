import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from "../model/user.model";
import { Payment } from '../model/payment.model';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	})
};

@Injectable({
	providedIn: 'root'
})
export class DlaService {
	loggedIn = false;
	authToken = '';
	user: any = '';

	// readonly mainURL = 'http://localhost:8080/dlabackend/api/';

	readonly mainURL = 'https://testbed.daystarng.org/api/';

	constructor(private http: HttpClient) {
	}

	registerUser(user: any) {
		const endPoint = 'register';

		return this.http.post(this.mainURL + endPoint, user, httpOptions).pipe(
			catchError(this.handleError)
		);
	}

	loginUser(email: string, password: string) {
		const body = {
			email,
			password
		};
		const endPoint = 'login';

		return this.http.post(this.mainURL + endPoint, body, httpOptions).pipe(
			catchError(this.handleError)
		);
	}

	activateAccount(bspoke: string, grad: string) {
		const body = {
			bspoke,
			grad
		};
		const endPoint = 'activateAccount';

		return this.http.post(this.mainURL + endPoint, body, httpOptions).pipe(
			catchError(this.handleError)
		);
	}

	forgotPassword(email: string) {
		const body = {
			email
		};
		const endPoint = 'resetPassword';

		return this.http.post(this.mainURL + endPoint, body, httpOptions).pipe(
			catchError(this.handleError)
		);
	}

	resetPassword(userId: string, password: string, token: string) {
		const customHttpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				Authorization: this.authToken
			})
		};
		const body = {
			userId,
			password
		};
		const endPoint = 'changePassword';

		return this.http.post(this.mainURL + endPoint, body, customHttpOptions).pipe(
			catchError(this.handleError)
		);
	}

	updateProfile(user: User) {
		const customHttpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				Authorization: this.authToken
			})
		};

		const endPoint = 'updateProfile';

		return this.http.post(this.mainURL + endPoint, user, customHttpOptions).pipe(
			catchError(this.handleError)
		);
	}

	getCurrentSessions() {

		// console.log('Auth Token  in Service', this.authToken);
		const customHttpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				Authorization: this.authToken
			})
		};

		const endPoint = 'getCurrentSessions';

		return this.http.get(this.mainURL + endPoint, customHttpOptions).pipe(
			catchError(this.handleError)
		);
	}

	getSessionAndTimeTable(session_id: string, user_id: string) {

		// console.log('Auth Token  in Service', this.authToken);
		const customHttpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				Authorization: this.authToken
			})
		};

		// console.log('Session_id in service ' + session_id);

		const endPoint = 'getSessionAndTimeTable/' + session_id + '/' + user_id;

		return this.http.get(this.mainURL + endPoint, customHttpOptions).pipe(
			catchError(this.handleError)
		);
	}

	makeOfflinePayment(payment: Payment) {
		const customHttpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				Authorization: this.authToken
			})
		};

		const endPoint = 'makeOfflinePayment';

		return this.http.post(this.mainURL + endPoint, payment, customHttpOptions).pipe(
			catchError(this.handleError)
		);
	}

	makeOnlinePayment(payment: Payment) {
		const customHttpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				Authorization: this.authToken
			})
		};

		const endPoint = 'makeOnlinePayment';

		return this.http.post(this.mainURL + endPoint, payment, customHttpOptions).pipe(
			catchError(this.handleError)
		);
	}

	makeDonation(payment: Payment) {
		const customHttpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				Authorization: this.authToken
			})
		};

		const endPoint = 'makeDonation';

		return this.http.post(this.mainURL + endPoint, payment, customHttpOptions).pipe(
			catchError(this.handleError)
		);
	}

	getIpAddress() {
		return this.http
			.get('https://api.ipify.org/?format=json')
			.pipe(
				catchError(this.handleError)
			);
	}

	private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(
				`Backend returned code ${error.status}, ` +
				`body was: ${error.error}`);
		}
		// return an observable with a user-facing error message
		return throwError(
			'Something bad happened; please try again later.');
	}
}
