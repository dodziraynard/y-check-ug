# y-check-ug

## Commands
* Test fitures
```bash
make dft
```

## Testing
```bash
make run_tests
```

## Local Data Syncing
### Setup Data
```bash
python manage.py setup-data
```

### Download Live/Server Adolescent Data
```bash
python manage.py dad
```

#### More Examples
```bash
python manage.py dad -e adolescent -p 2 # Download only adolescent starting from page 2
python manage.py dad -e adolescentresponse -p 1 # Download only adolescent responses starting from page 1
python manage.py dad -e summaryflag -p 1 # Download only summary flags starting from page 1
python manage.py dad -e referral -p 1 # Download only referrals starting from page 1
python manage.py dad -e treatment -p 1 # Download only treatments starting from page 1
python manage.py dad -e conditiontreatment -p 1 # Download only condition treatments starting from page 1


python manage.py setup-data -e flaglabel # Download only flag labels starting from page 1
python manage.py setup-data -e flagcolor
python manage.py setup-data -e flagcondition
python manage.py setup-data -e service
python manage.py setup-data -e checkuplocation
python manage.py setup-data -e facility
python manage.py setup-data -e user
python manage.py setup-data -e questiongroup
python manage.py setup-data -e section
python manage.py setup-data -e question
python manage.py setup-data -e option
python manage.py setup-data -e previousresponserequirement

# Note: Order is important
```