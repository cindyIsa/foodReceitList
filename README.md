# shop-list

## Project introduce
the project is the practise of search input component , some of data is from k-city market website, but the data is the simple ones which is just used for practise. The original data is .csv file, and we used mongodb, so merge the csv file to monodb.

## merge csv file to mongodb
```
 mongoimport — db database — collection collection — type csv — headerline — ignoreBlanks — file [local path]
```

### serve base golang 
## use github.com/julienschmidt/httprouter to get the parameter of route which passed by parameters 
```
go get github.com/julienschmidt/httprouter
```
