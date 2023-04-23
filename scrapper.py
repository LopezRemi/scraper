import json
import os
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from selenium.webdriver.support.ui import WebDriverWait

driver = webdriver.Chrome()
driver.get('https://www.allrecipes.com/ingredients-a-z-6740416')
time.sleep(2)
ingredients = driver.find_elements(By.CLASS_NAME, 'link-list__link')
ingredient_names = []
ingredient_infos = []
ingredients_href =  []
ingredient_recipes_links = []
recipes_object = []
recipes_list = []
recipes_images = []
recipes_href = []

for ingredient in ingredients:
    ingredient_names.append(ingredient.text)
    ingredients_href.append(ingredient.get_attribute('href'))

for id_ingredient, ingredient_link in enumerate(ingredients_href):
    if id_ingredient < 2:
        recipes_href_this_ingredient = []
        recipes_images_this_ingredient = []
        driver.get(ingredient_link)
        time.sleep(1)
        recipes_images = driver.find_elements(By.CLASS_NAME, 'card__img')
        recipes_links = driver.find_elements(By.CLASS_NAME, 'mntl-card-list-items')
        for recipe_link, recipe_image in zip(recipes_links, recipes_images):
            if len(recipes_href_this_ingredient) == 15:
                break
            output = recipe_link.get_attribute('href') in recipes_href
            outputImg = recipe_image.get_attribute('src') in recipes_images
            recipes_href.append(recipe_link.get_attribute('href'))
            if recipe_image.get_attribute('src'):
                recipes_images.append(recipe_image.get_attribute('src'))
            elif recipe_image.get_attribute('data-src'):
                recipe_image.get_attribute('data-src')
            if output == False:
                recipes_href_this_ingredient.append(recipe_link.get_attribute('href'))
                recipes_href.append(recipe_link.get_attribute('href'))
                if recipe_image.get_attribute('src'):
                    recipes_images_this_ingredient.append(recipe_image.get_attribute('src'))
                elif recipe_image.get_attribute('data-src'):
                    recipes_images_this_ingredient.append(recipe_image.get_attribute('data-src'))

        for href, image in zip(recipes_href_this_ingredient, recipes_images_this_ingredient):
            if len(recipes_list) == 15:
                break
            driver.get(href)
            isRecipe = driver.find_elements(By.CLASS_NAME, 'article-subheading')
            if isRecipe:
                titre_recette = driver.find_elements(By.CLASS_NAME, 'article-heading')[0].text
                recette_check = next(filter(lambda x: titre_recette in x['title'], recipes_object), None)
                if recette_check is None:
                    oneRecipe = {
                        'title': titre_recette,
                        'image': image,
                        'ingredient' : [ingredient_names[id_ingredient]],
                        'description': driver.find_elements(By.CLASS_NAME, 'article-subheading')[0].text
                    }
                    recipes_object.append(oneRecipe)
                    recipes_list.append(titre_recette)
                else :
                    if ingredient_names[id_ingredient] not in recette_check['ingredient']:
                        recette_check['ingredient'].append(ingredient_names[id_ingredient])

        driver.get('https://www.allrecipes.com/ingredients-a-z-6740416')
        
ingredients_list = {
    'ingredients': ingredient_names,
}

recipes_list = {
    'recipes': recipes_object,
}

with open('ingredients.json', 'w') as f:
    json.dump(ingredient_names, f)

with open('recipes.json', 'w') as f:
    json.dump(recipes_object, f)
    
driver.quit()