# ResumeBuilder

## 1. What we built

https://resumebuilder-i900.onrender.com
We built a resume builder for students and job seekers who want to reuse their experience without starting over for every application. We keep personal details, education, work experience, projects, activities, skills, and awards in separate bins on the Account page. We can add as many entries as we need and leave out anything that does not apply.

We use those saved details to build several named resumes under one account. We choose what goes into each resume, edit the wording, change the section order, and see a PDF preview before downloading it. We use one simple template with font size and spacing choices so the resumes stay easy to read. Our live app link is pending.

## 2. How to use our app

We start by registering with an email and a password of at least eight characters. We do not need a shared class login. After signing in, we fill out the bins on the Account page and choose Save Information. We pick a month and year for dates.

We then open Resume Builder, name the resume, and check the entries we want to include. We can edit the text for that resume without changing our account bins. We can move or hide sections and adjust the font size and spacing. We choose Save resume to keep our work, Save as copy to make another version, or Download PDF to get the file. We can reopen saved resumes from Account or Resume Builder. We save our changes before leaving the editor.

## 3. What we used

We used React and JavaScript to build the forms, switch between pages, and update the preview as we make changes. We used CSS in JS to keep our colors, spacing, buttons, and page layouts together. We added clear labels, keyboard focus styles, and layouts that fit smaller screens.

We used Node.js and Express for registration, login, saving information, and making PDFs. We stored accounts, bins, and saved resumes in MongoDB. We used bcryptjs to hash passwords and sessions to keep track of who is signed in. We tied saved resumes to the account that created them.

We used LaTeX through XeLaTeX to turn the selected information into a PDF. We used PDF.js to show that same PDF inside the browser. We first listed jsPDF in our proposal, but we chose LaTeX for the finished resume template. We run LaTeX on the server, so people using the app do not need to install it.

## 4. What challenged us

We had to keep reusable account information separate from each saved resume. We solved this by saving a copy of the selected content with each version. That lets us change one resume without changing another or losing the original information in our bins.

We also had to make the preview show the same file that we download. The browser PDF viewer did not display it reliably, so we used PDF.js to draw the pages. We handled characters such as percent signs and ampersands before passing text to LaTeX. We also made sure older preview requests could not replace a newer preview.

We brought together forms written by different team members and made them follow the same data shape. We checked saving, reopening, copying, and downloading resumes. We also tested that one account cannot open another account's saved resume and checked the layout at desktop and phone sizes.

## 5. How we shared the work

We split the project by user tasks instead of giving one person the frontend and another person the backend. We each worked across the page, server, and stored data needed for our features. We shared fixes and testing as we brought those parts together.

Aidan Fisher focused more on MongoDB, account registration, and login. Our original plan also assigned personal information and the professional summary to Aidan.

Austin Peterson focused more on building the resume bins, especially education. Aishwarya Silam also focused on building the bins, especially skills, certifications, awards, and accomplishments. We used the same form pattern so these sections could work together.

Andry Nasief focused more on PDF creation, the resume preview, and CSS. Our original plan also assigned work experience, projects, and activities to Andry. We connected these parts so we could choose saved information and turn it into different resumes.

## 6. Our project video

video link