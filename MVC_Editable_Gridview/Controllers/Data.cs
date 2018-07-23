using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MVC_Editable_Gridview.Models;

namespace MVC_Editable_Gridview.Controllers {
    public static class Data {
        private static List<DotaObject> DotaObjects = new List<DotaObject>() {
            new DotaObject() {
                ID = 0,
                Hero = "Visage",
                Type = "INT",
                Faction = "Dire"
            },
            new DotaObject() {
                ID = 1,
                Hero = "Meepo",
                Type = "AGI",
                Faction = "Dire",
            },
            new DotaObject() {
                ID = 2,
                Hero = "Windrunner",
                Type = "INT",
                Faction = "Dire"
            },
            new DotaObject() {
                ID = 3,
                Hero = "Windrunner",
                Type = "INT",
                Faction = "Radiant"
            },
            new DotaObject() {
                ID = 4,
                Hero = "Phantom Lancer",
                Type = "AGI",
                Faction = "Radiant"
            },
            new DotaObject() {
                ID = 5,
                Hero = "Bloodseeker",
                Type = "AGI",
                Faction = "Dire"
            },
            new DotaObject() {
                Hero = "Alchemist",
                Type = "STR",
                Faction = "Radiant"
            },
            new DotaObject() {
                ID = 6,
                Hero = "Mirana",
                Type = "AGI",
                Faction = "Radiant"
            },
            new DotaObject() {
                ID = 7,
                Hero = "Lion",
                Type = "INT",
                Faction = "Dire"
            }
        };

        public static int CREATE(DotaObject model) {
            Random random = new Random();
            int randomNumber = random.Next(0, 1000);
            model.ID = randomNumber;
            DotaObjects.Add(model);
            return 0;
        }
        public static List<DotaObject> READ() {
            return DotaObjects;
        }
        public static int UPDATE(DotaObject model) {
            foreach(var item in DotaObjects.Where(i => i.ID.Equals(model.ID))) {
                item.Hero = model.Hero;
                item.Faction = model.Faction;
                item.Type = model.Type;
            }
            return 0;
        }
        public static int DELETE (int id) {
            DotaObjects.RemoveAll(x => x.ID.Equals(id));
            return 0;
        }
    }
}