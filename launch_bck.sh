cd backend || exit 1

pipenv shell

py manage.py runserver

cd ..

cd frontend

cd app-frontend || exit 1

npm run dev

echo "Website launched"