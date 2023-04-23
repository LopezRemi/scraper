import json
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from selenium.webdriver.support.ui import WebDriverWait


# créer une instance du navigateur
driver = webdriver.Firefox()

# ouvrir la page web
driver.get("https://www.allrecipes.com/ingredients-a-z-6740416")

# attendre que la page se charge complètement
time.sleep(2)

# extraire les éléments <a> qui contiennent les liens des ingrédients
ingredients = driver.find_elements(By.CLASS_NAME, "link-list__link")
recipes_list = []
recipes_images = []
ingredient_names = []
ingredient_recipes_links = []
recipes_links = []

# afficher les liens des ingrédients
for index, ingredient in enumerate(ingredients):
    if index > 2 : 
        ingredients_link = ingredient.get_attribute("href")
        ingredient_recipes_links.append(ingredients_link)
    # recipes_list.append({
    #     "recipes": []
    #     })
    # ingredient_names.append(link.text)

for link in ingredient_recipes_links:
    driver.get(link)
    ingredient_name = driver.find_element(By.ID, "mntl-taxonomysc-heading_1-0").text
    # print(ingredient_name)
    # print('-------------------------------------------')
    WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.CLASS_NAME, "card__title-text")))
    # Wait for the title element to be visible before continuing
    cards = driver.find_elements(By.CLASS_NAME, "mntl-card-list-items")
    for card in cards:
        recipes_link = card.get_attribute("href")
        recipes_links.append(recipes_link)

for id, link_recipe in enumerate(recipes_links):
        driver.get(link_recipe)
        print(id)

# créer un objet JSON avec la liste des noms d'ingrédients
ingredients_json = {"ingredients": ingredient_names}

# enregistrer l'objet JSON dans un fichier
with open("ingredients.json", "w") as f:
    json.dump(ingredients_json, f)

# driver.quit()