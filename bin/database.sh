psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'sparkpost_lab'" | grep -q 1 || psql -U postgres -c "CREATE DATABASE sparkpost_lab"
