import sqlite3
import functools
import json


DB_NAME = 'listenit.db'
DB_PATH = 'db/'


class Database(object):
   def __init__(self, db_name=DB_NAME, db_path=DB_PATH):
      self.db_name = db_name
      self.db_path = db_path  
      self.create_db()
   
   def create_db(self): 
      conn = self.connection()      
      conn.execute('''CREATE TABLE IF NOT EXISTS achievement (
                         audio_id   INTEGER, 
                         user_id    INTEGER, 
                         result     INTEGER CHECK(result >= 0 AND result <= 100) DEFAULT 0,
                         PRIMARY KEY (audio_id, user_id) 
                         FOREIGN KEY(audio_id) REFERENCES audio(id) );
                   ''')

      conn.execute('''CREATE TABLE IF NOT EXISTS audio (
                         id         INTEGER PRIMARY KEY AUTOINCREMENT, 
                         title      TEXT, 
                         source     TEXT,
                         owner_id   INTEGER,
                         is_public  INTEGER );
                   ''')
      conn.close()

   def connection(self):
      return self.Connection(self.db_path + self.db_name)


   class Connection(object):

      def __init__(self, database_file):
         self.conn = sqlite3.connect(database_file)
         self.conn.execute('pragma foreign_keys=ON')

      def close(self):
         self.conn.commit()
         self.conn.close()

      def auto_commit(function):
         @functools.wraps(function)
         def wrapper(self, *args, **kwargs):
            result = function(self, *args, **kwargs)
            self.conn.commit()
            return result
         return wrapper

      def execute(self, sql_statement):
         self.conn.execute(sql_statement) 
      
      def get_audio_info(self, user_id, fields='id, title, source, owner_id, is_public'):            
         params = (user_id, )              
         curs = self.conn.cursor()    
         curs.execute('''SELECT {} 
                         FROM   audio
                         WHERE  owner_id == ? OR is_public != 0
                      '''.format(fields), params)
         
         return self.sql_response_to_json(fields, curs.fetchall())

      def get_achievement_info(self, user_id, fields='audio_id, user_id, result'):
         params = (user_id, )  
         curs = self.conn.cursor()    
         curs.execute('''SELECT {} 
                         FROM   achievement
                         WHERE  user_id == ?
                      '''.format(fields), params)
         return self.sql_response_to_json(fields, curs.fetchall())

      @auto_commit
      def update_achievement(self, audio_id, user_id, result): 
         params = (audio_id, user_id, result)
         self.conn.execute('''INSERT OR REPLACE INTO achievement VALUES (?,?,?);
                           ''', params)

      @auto_commit
      def add_audio(self, title, source, owner_id, is_public):
         params = (title, source, owner_id, is_public)
         self.conn.execute('''INSERT INTO audio (title, source, owner_id, is_public) 
                              VALUES (?,?,?,?);
                           ''', params)

      @staticmethod
      def sql_response_to_json(titles, rows):
         titles_list = titles.split(',')
         result_json = []            

         for row in rows:
               if (len(titles_list) != len(row)):
                     raise DBParameterException('sql response to json transformation error')
               result_json.append( {title.strip(): cell for title, cell in zip(titles_list, row)} )            
         
         return json.dumps(result_json)



class DBException(Exception):
      pass

class DBParameterException(DBException):
      pass
