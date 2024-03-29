import React, { useState, useEffect } from "react";
import { Card, Pane, Group, Button, TrashIcon, ManualIcon } from "evergreen-ui";
import { Link } from "react-router-dom";
import RecipeForm from "./RecipeForm";

function MyRecipes() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        fetchRecipes()
        .then((res) => res.json())
        .then((json) => setRecipes(json["recipe_list"]))
        .catch((error) => console.log(error));
    }, []);

    function fetchRecipes() {
        const promise = fetch("http://localhost:8000/recipes");
        return promise;
    }

    function postRecipe(recipe) {
        const promise = fetch("Http://localhost:8000/recipes", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(recipe),
        });

        return promise;
    }

    function removeOneRecipe(index) {
        let id
        recipes.forEach((recipe, i) => {
            if (i === index) {
                id = recipe._id
            };
        });
        const updated = recipes.filter((character, i) => {
          return i !== index;
        });
        deleteRecipe(id)
        .then((res) => {
            if (res.status === 204) {
                setRecipes(updated);
            } else {
                console.log("Error: " + res.status + " No object found.");
            }})
        .catch((error) => {
            console.log(error);
        });
    }

    function deleteRecipe(id) {
        const promise = fetch(`Http://localhost:8000/recipes/${id}`, {
            method: "DELETE",
        });
        return promise;
    }

    function updateList(recipe) {
        postRecipe(recipe)
        .then((res) => {
            if (res.status === 201) {
                return res.json()
                
            } else {
                console.log("Error: " + res.status);
                return undefined;
            }
        })
        .then((json) => {
            if(json) setRecipes([...recipes, json])
        })
        .catch((error) => {
          console.log(error);
        })
    }



    return (
        <Pane>
            <Group>
                {recipes.map((recipe, index) => (
                    <Card
                        key={index}
                        elevation={1}
                        margin={16}
                        padding={16}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <h3>{recipe.name}</h3>
                        <Button iconAfter={ManualIcon}>
                            <Link to={`/recipe/${recipe._id}`}>View</Link>
                        </Button>
                        <Button intent="danger" iconAfter={TrashIcon} onClick={() => removeOneRecipe(index)}>Delete</Button>
                    </Card>
                ))}
            </Group>
            <RecipeForm handleSubmit={updateList}/>
        </Pane>
    );
}

export default MyRecipes;