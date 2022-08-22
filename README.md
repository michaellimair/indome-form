# InDome Form

Form made for the InDome 2022: Roof Rave Party event. Made with Next.js, Tailwind CSS, Flowbite React, and Mongoose. Deployed in Google Cloud Run with a MongoDB Cloud database and Google Cloud Storage for object storage.

## How to use

```
yarn
yarn dev
```

## Deployment

```
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICENAME --project $PROJECT_ID
gcloud run deploy --service $SERVICENAME --image gcr.io/$PROJECT_ID/$SERVICENAME --project $PROJECT_ID --platform managed --region $REGION --set-secrets=INDOME_DB_NAME=INDOME_DB_NAME:latest,INDOME_MONGODB_URI=INDOME_MONGODB_URI:latest,INDOME_GCP_BUCKET=INDOME_GCP_BUCKET:latest,INDOME_ADMIN_SECRET=INDOME_ADMIN_SECRET:latest,GOOGLE_CLIENT_ID=GOOGLE_CLIENT_ID:latest,GOOGLE_CLIENT_SECRET=GOOGLE_CLIENT_SECRET:latest,GOOGLE_REFRESH_TOKEN=GOOGLE_REFRESH_TOKEN:latest --allow-unauthenticated
```
