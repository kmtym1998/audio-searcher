package elasticsearch

import (
	"encoding/json"
)

type QueryRoot struct {
	Query *Query `json:"query,omitempty"`
	Size  *int   `json:"size,omitempty"`
	From  *int   `json:"from,omitempty"`
}
type Query struct {
	Bool          *Bool          `json:"bool,omitempty"`
	Must          *Must          `json:"must,omitempty"`
	MustNot       *MustNot       `json:"must_not,omitempty"`
	Should        *Should        `json:"should,omitempty"`
	Nested        *Nested        `json:"nested,omitempty"`
	FunctionScore *FunctionScore `json:"function_score,omitempty"`
	Match         *Match         `json:"match,omitempty"`
	Term          *Term          `json:"term,omitempty"`
	Exists        *Exists        `json:"exists,omitempty"`
}
type Bool = Query
type Must = []Query
type MustNot = []Query
type Should = []Query
type Match = map[string]any
type Term = map[string]Value
type Value struct {
	Value any `json:"value"`
}
type Nested struct {
	Path  string `json:"path,omitempty"`
	Query *Query `json:"query,omitempty"`
}
type Exists struct {
	Field string `json:"field,omitempty"`
}
type FunctionScore struct {
	BoostMode        string           `json:"boost_mode"`
	FieldValueFactor FieldValueFactor `json:"field_value_factor"`
	MaxBoost         int32            `json:"max_boost"`
	Query            *Query           `json:"query"`
}
type FieldValueFactor struct {
	Factor   float32 `json:"factor"`
	Field    string  `json:"field"`
	Missing  float32 `json:"missing"`
	Modifier string  `json:"modifier"`
}

func (q QueryRoot) ToString() string {
	b, err := json.Marshal(q)
	if err != nil {
		panic(err)
	}

	return string(b)
}
