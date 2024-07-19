import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { first } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    error = '';

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authenticationService: AuthService
    ) {}

    ngOnInit() {
        this.loginForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    get formControls() {
        return this.loginForm.controls;
    }

    onSubmit() {
        if (this.loginForm.invalid) {
            return;
        }

        this.authenticationService
            .login(
                this.formControls['email'].value,
                this.formControls['password'].value
            )
            .pipe(first())
            .subscribe({
                next: () => {
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    this.error = error;
                },
            });
    }
}
