package main

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type Food struct {
	FoodName string `bson:"foodname"`
	Time     string
	Url      string
}

func connect_mongodb() (context.Context, *mongo.Client, *mongo.Collection, error) {
	ctx := context.TODO()
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost"))
	err = client.Ping(ctx, &readpref.ReadPref{})
	if err != nil {
		panic(err)
	}
	collection := client.Database("kmarket").Collection("foods")
	return ctx, client, collection, err
}
func saveResponse(cur *mongo.Cursor, ctx context.Context) []byte {
	var dataArray = []Food{}
	for cur.Next(ctx) {
		newFood := new(Food)
		cur.Decode(newFood)
		dataArray = append(dataArray, *newFood)
	}
	result, _ := json.Marshal(dataArray)
	return result
}
func getData(res http.ResponseWriter, req *http.Request, ps httprouter.Params) {
	ctx, client, collection, err := connect_mongodb()
	defer func() {
		if err = client.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()
	keyword := ps.ByName("keyword")
	limit, _ := strconv.ParseInt(ps.ByName("limit"), 0, 64)
	page, _ := strconv.ParseInt(ps.ByName("page"), 0, 64)
	skip := page * limit
	options := options.FindOptions{
		Limit: &limit,
		Skip:  &skip,
	}
	cursor := new(mongo.Cursor)
	if keyword != "all" {
		cursor, err = collection.Find(ctx,
			bson.M{"foodname": bson.M{"$regex": primitive.Regex{Pattern: keyword, Options: "i"}}},
			&options)
		if err != nil {
			panic(err.Error())
		}
	} else {
		cursor, err = collection.Find(ctx, bson.D{}, &options)
		if err != nil {
			panic(err.Error())
		}
	}

	defer cursor.Close(ctx)
	result := saveResponse(cursor, ctx)
	res.Write(result)
}

func main() {
	const host = "127.0.0.1:3000"
	router := httprouter.New()
	router.GET("/get/:page/:limit/:keyword", getData)
	http.ListenAndServe(host, router)

}
