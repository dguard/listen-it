from mido import MidiFile
from fractions import Fraction
import sys, traceback
import json

class small_note:
    def __init__(self, note):
        self.note = note.get_note_name()
        self.duration = str(note.music_size.numerator) + "/" + str(note.music_size.denominator)

class note:
    def __init__(self, time_st, note, velocity):
        self.time_st = time_st
        self.note = note
        self.velocity_st = velocity
        self.time_fin = time_st
        self.velocity_fin = velocity
        self.end = False
        self.music_size =0

    def count_music_size(self, time_in_tact):
        self.music_size = Fraction((self.time_fin - self.time_st), int(time_in_tact))

    def __repr__(self):
        return "{note " + str(self.note) + ", time_st " + str(self.time_st) + ", time_fin "+ str(self.time_fin) + ", music_size " + str(self.music_size) + "}"

    def get_note_name(self):
        chord = ['C', 'C#','D','D#','E','F','F#','G','G#','A','A#', 'B']
        return str(int(self.note/12)-2) + chord[self.note % 12]

class track:
    def __init__(self, name, ppnq, last_time_in_tact, tempo,size):
        self.name = name
        self.track_name = ""
        self.channels = {}
        self.ppnq = ppnq
        self.tmp_time = 0
        self.time_in_tact = last_time_in_tact
        self.tempo = tempo
        self.size = size
        self.handlers = {"set_tempo" : self.set_tempo,
                         "time_signature" : self.time_signature,
                         "track_name" : self.track_name,
                         "control_change" : self.empty,
                         "note_on" : self.note_on,
                         "note_off" : self.note_off,
                         "end_of_track" : self.empty,
                         "program_change" : self.empty,
                         "pitchwheel" : self.empty}

    def empty(self, msg):
        pass

    def set_tempo(self, msg):
        self.tempo = msg.tempo


    def time_signature(self, msg):
        self.numerator = msg.numerator
        self.denominator = msg.numerator
        self.time_in_tact = self.ppnq * 4 * self.numerator / self.denominator
        self.size = str(msg.numerator) + "/" + str(msg.denominator)

    def track_name(self, msg):
        self.track_name = msg.name

    def control_change(self, msg):
        if(self.track_name != ""):
            self.channels[msg.channel] = {"name" : self.track_name}
            self.track_name = ""

    def note_on(self, msg):
        if not msg.channel in self.channels :
            self.channels[msg.channel] = {}
        if not "notes" in self.channels[msg.channel]:
            self.channels[msg.channel]["notes"] = []
        self.channels[msg.channel]["notes"].append(note(self.tmp_time, msg.note, msg.velocity))
        self.tmp_time += msg.time

    def note_off(self, msg):
        self.tmp_time += msg.time
        if (msg.channel in self.channels) and "notes" in self.channels[msg.channel]:
            for note in self.channels[msg.channel]["notes"][::-1]:
                if note.note == msg.note:
                    note.time_fin = self.tmp_time
                    note.velocity_fin = msg.velocity
                    note.end = True
                    note.count_music_size(self.time_in_tact)
                    break

    def get_tacts(self, tacts, tempo, size):
        result = {}
        for ch in self.channels:
            if not "notes" in self.channels[ch]:
                continue
            tacts = []
            tact_fin = self.time_in_tact
            tact = {'sounds': []}
            for note in self.channels[ch]["notes"]:
                if(note.time_fin <= tact_fin):
                    tact['sounds'].append(small_note(note))
                else:
                    tacts.append(tact)
                    tact = {'sounds': []}
                    tact_fin += self.time_in_tact
                    tact['sounds'].append(small_note(note))
            tacts.append(tact)
            if len(self.channels[ch]) != 0:
                result[ch] = {"tacts" : tacts, "temp" : (60000000 / tempo), "beat" : size}
        return result

class MyEncoder(json.JSONEncoder):
    def default(self, o):
        return o.__dict__

def generate_json(source, initial_name):
    answer = {"status": "success", "data": {"source": initial_name, "tracks": []}}
    try:
        mid = MidiFile(source)
        time_in_tact = 1
        tempo = 120 * 60000000
        size = ""
        for i, tr in enumerate(mid.tracks):
            t = track(source, mid.ticks_per_beat, time_in_tact, tempo, size)
            for message in tr:
                try:
                    t.handlers[message.type](message)
                except Exception as e:
                    pass
                    # print(e)
                    # answer["status"] = e
            time_in_tact = t.time_in_tact
            tempo = t.tempo
            size = t.size
            js_track = {"channels": t.get_tacts(t.time_in_tact, t.tempo, t.size)}
            if t.track_name != "":
                js_track["track_name"] = t.track_name
            if len(js_track["channels"]) > 0:
                answer["data"]["tracks"].append(js_track)
    except Exception as e:
        return {"status": "error", "data": {"message": 'Cannot parse file'}}
    return answer


def get_json_for_file(filename, initial_name):
    return json.dumps(generate_json(filename, initial_name), cls=MyEncoder, indent=4)